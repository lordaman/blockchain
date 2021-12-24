const Blockchain = require('./blockchain');
const newcoin = new Blockchain();

const bc1 = {
    "chain": [
      {
        "index": 1,
        "timestamp": 1626314809336,
        "transactions": [],
        "nonce": 100,
        "hash": "0",
        "previousBlockHash": "0"
      },
      {
        "index": 2,
        "timestamp": 1626314874314,
        "transactions": [
          {
            "amount": 300,
            "sender": "HSDUSHD$DVGDS%UIHyuIUH",
            "recipient": "DGFYUDSGFDS%YyuUFG",
            "transactionId": "534ec92ecb6942e6a196f687b1250d4c"
          },
          {
            "amount": 400,
            "sender": "HSDUSHD$DVGDS%UIHyuIUH",
            "recipient": "DGFYUDSGFDS%YyuUFG",
            "transactionId": "6c20c456fe72427087677955d95bb804"
          }
        ],
        "nonce": 86899,
        "hash": "0000dd25040a320fc67560110408f376463e49a86f19ead2c7ac948185a978cd",
        "previousBlockHash": "0"
      },
      {
        "index": 3,
        "timestamp": 1626314885336,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "afc746c5889f452c8bad3e72d1876e7d",
            "transactionId": "1afe62e9a71e430aadd7470df4025400"
          }
        ],
        "nonce": 68008,
        "hash": "0000f4c9a18cad7123b7923b92b49b2761c8d70c2c6b267a3a02f446ad439ad3",
        "previousBlockHash": "0000dd25040a320fc67560110408f376463e49a86f19ead2c7ac948185a978cd"
      },
      {
        "index": 4,
        "timestamp": 1626314913424,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "afc746c5889f452c8bad3e72d1876e7d",
            "transactionId": "1b632d302dfb4c5db70bcec753d1c93b"
          },
          {
            "amount": 40,
            "sender": "HSDUSHD$DVGDS%UIHyuIUH",
            "recipient": "DGFYUDSGFDS%YyuUFG",
            "transactionId": "40e11e77931a41b9a3550479850ebb9c"
          },
          {
            "amount": 50,
            "sender": "HSDUSHD$DVGDS%UIHyuIUH",
            "recipient": "DGFYUDSGFDS%YyuUFG",
            "transactionId": "e7fb95048578439ba1b6d9acd558e6e4"
          },
          {
            "amount": 60,
            "sender": "HSDUSHD$DVGDS%UIHyuIUH",
            "recipient": "DGFYUDSGFDS%YyuUFG",
            "transactionId": "bbde97c283cb4f74affff2b0cf8002a3"
          },
          {
            "amount": 70,
            "sender": "HSDUSHD$DVGDS%UIHyuIUH",
            "recipient": "DGFYUDSGFDS%YyuUFG",
            "transactionId": "641d13199c844b27941fb5fa03256cf7"
          }
        ],
        "nonce": 8482,
        "hash": "000075d13b437099c53fc1771b83fe7c17f5bbb73b8418453613e560b44e8099",
        "previousBlockHash": "0000f4c9a18cad7123b7923b92b49b2761c8d70c2c6b267a3a02f446ad439ad3"
      },
      {
        "index": 5,
        "timestamp": 1626314926228,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "afc746c5889f452c8bad3e72d1876e7d",
            "transactionId": "ac2d4ecbff374b83bc5ac8983d609932"
          }
        ],
        "nonce": 39662,
        "hash": "0000f6c6078c53c047e525e40f9d0b852be0533123fa2a74cf1dea9249eafe43",
        "previousBlockHash": "000075d13b437099c53fc1771b83fe7c17f5bbb73b8418453613e560b44e8099"
      },
      {
        "index": 6,
        "timestamp": 1626314928737,
        "transactions": [
          {
            "amount": 12.5,
            "sender": "00",
            "recipient": "afc746c5889f452c8bad3e72d1876e7d",
            "transactionId": "b49ed7d12a8840c4be795299cbd9ce06"
          }
        ],
        "nonce": 13731,
        "hash": "00003cf33e48d139d66e198ea67b7fb8de2af6d8f668ae42fff07138ed0fdb5e",
        "previousBlockHash": "0000f6c6078c53c047e525e40f9d0b852be0533123fa2a74cf1dea9249eafe43"
      }
    ],
    "pendingTransactions": [
      {
        "amount": 12.5,
        "sender": "00",
        "recipient": "afc746c5889f452c8bad3e72d1876e7d",
        "transactionId": "36415c6b58d84c3fb18fae858531f678"
      }
    ],
    "currentNodeUrl": "http://localhost:3001",
    "networkNodes": []
  }

  console.log(newcoin.chainIsValid(bc1.chain));
