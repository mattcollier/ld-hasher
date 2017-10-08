const config = require('bedrock').config;

config.core.workers = 1;

config['ld-hasher'] = {};

config['ld-hasher'].loops = 500;

config['ld-hasher'].doc = {
  "@context": "https://w3id.org/webledger/v1",
  "type": "WebLedgerEvent",
  "operation": "Create",
  "input": [
    {
      "@context": "https://w3id.org/test/v1",
      "id": "https://example.com/events/e908ecba-8be3-46db-83fd-48886a96aac2",
      "type": "Concert",
      "name": "Primary Event",
      "startDate": "2017-07-14T21:30",
      "location": "https://example.org/the-venue-new-york",
      "offers": {
        "type": "Offer",
        "price": "13.00",
        "priceCurrency": "USD",
        "url": "https://bedrock.local:18443/purchase/de32093f-9fdb-4739-90e9-79b86324bb93"
      }
    }
  ],
  "signature": {
    "type": "LinkedDataSignature2015",
    "created": "2017-10-06T18:32:25Z",
    "creator": "https://bedrock.local:18443/consensus/continuity2017/voters/004be801-88e3-4c60-b9ea-15a5e5a378ac#key",
    "signatureValue": "BxqFt5cd3uAuiS+hg8+l72bQdnh2k57GXlWOiFIgi/7D8JDMhSzottFCQTFKKEsrzD2kwlNl7xUZZNEIXuBHInQ9uBemIkbCr5IkGEMUS5QQtFmHxbn1mIw+aqhpQHKpjQTFAnQ/OlxOx2dQgup+fwGWwdglOWtQqaV95Zd25Kj8sq5eP1kUljJZo4ls+mz4dng10jp6XS0UEQYhWe5gg/jbGQD6+7AWoXfP2rlGuUqR4qZMCvclcDkQ71PsYLPGoHsnTFhe3eIvKCPmaFGQSWFeLf17g/qqNo9K/aZcQi2TL3NL9mokGxiRty/PHVUoRiQ5qvqgm05KPlEvU44SUQ=="
  }
};
