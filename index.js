const async = require('async');
const bedrock = require('bedrock');
const config = bedrock.config;
const jsonld = bedrock.jsonld;
const niUri = require('ni-uri');
require('bedrock-ledger-context');

require('./config');

const AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./aws-config.json');

const lambda = new AWS.Lambda();

const lParams = {
  FunctionName: 'jsonldNormalize',
  InvocationType: 'RequestResponse',
  Payload: JSON.stringify(config['ld-hasher'].doc)
};

const loops = config['ld-hasher'].loops;
const doc = config['ld-hasher'].doc;

bedrock.events.on('bedrock.started', () =>
  bedrock.runOnce('ld-hasher.benchmark', callback =>
    async.series([
      // callback => {
      //   console.log('async times limit');
      //   const hrstart = process.hrtime();
      //   async.timesLimit(
      //     loops, 10000, (i, callback) => hasher(doc, callback), err => {
      //       console.log('Done', err);
      //       const hrend = process.hrtime(hrstart);
      //       console.log(
      //         'Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
      //       callback();
      //     });
      // },
      // callback => {
      //   console.log('async times');
      //   const hrstart = process.hrtime();
      //   async.times(
      //     loops, (i, callback) => hasher(doc, callback), err => {
      //       console.log('Done', err);
      //       const hrend = process.hrtime(hrstart);
      //       console.log(
      //         'Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
      //       callback();
      //     });
      // },
      callback => {
        console.log('lambda');
        const hrstart = process.hrtime();
        async.times(
          loops, (i, callback) => lambda.invoke(lParams, callback), err => {
            console.log('Done', err);
            const hrend = process.hrtime(hrstart);
            console.log(
              'Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
            console.log('Ops per second', loops / hrend[0]);
            callback();
          });
      },
      callback => {
        console.log('async times series');
        const hrstart = process.hrtime();
        async.timesSeries(
          loops, (i, callback) => hasher(doc, callback), err => {
            console.log('Done', err);
            const hrend = process.hrtime(hrstart);
            console.log(
              'Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
            console.log('Ops per second', loops / hrend[0]);
            callback();
          });
      },
      // callback => {
      //   console.log('one doc');
      //   const hrstart = process.hrtime();
      //   hasher(doc, err => {
      //     const hrend = process.hrtime(hrstart);
      //     console.log('Done', err);
      //     console.log(
      //       'One doc time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);
      //     callback();
      //   });
      // }
    ], callback), bedrock.exit));

function hasher(data, callback) {
  async.auto({
    // normalize ledger event to nquads
    normalize: callback => jsonld.normalize(data, {
      algorithm: 'URDNA2015',
      format: 'application/nquads'
    }, callback),
    hash: ['normalize', (results, callback) => {
      const hash = niUri.digest('sha-256', results.normalize, true);
      callback(null, hash);
    }]
  }, (err, results) => callback(err, results.hash));
}

bedrock.start();
