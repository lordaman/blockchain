const express = require('express');
const Blockchain = require('./blockchain');
const app = express()
const { v4: uuidv4 } = require('uuid');
const port = process.argv[2];
const axios = require('axios').default;
const { request } = require('express');

const url = 'http://localhost:'+port;
const newcoin = new Blockchain(url);
const nodeAddress = uuidv4().split('-').join('');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

 
// fetch entire blockchain
app.get('/blockchain', function (req, res) {
  res.send(newcoin);
});

// create a new transaction
app.post('/transaction', function (req, res) {
  const newTransaction = req.body.newTransaction;
  const blockIndex = newcoin.addTransactionToPendingTransactions(newTransaction);
  res.json({note: `Transaction will be added in block ${blockIndex}`});
});

app.post('/transaction/broadcast', function(req, res) {
  const newTransaction = newcoin.createNewTransaction(
    req.body.amount, req.body.sender, req.body.recipient
  );
  newcoin.addTransactionToPendingTransactions(newTransaction);
  
  const requestPromises = [];
  newcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      url: networkNodeUrl + '/transaction',
      method: 'POST',
      data: {newTransaction: newTransaction},
      json: true
    };
    requestPromises.push(axios(requestOptions));
  });
  Promise.all(requestPromises)
  .then(data => {
    res.json({note: 'Transaction created and broadcast successfully!'});
  });
});

app.post('/receive-new-block', function(req, res) {
  const newBlock = req.body.newBlock;
  const lastBlock = newcoin.getLastBlock();
  const correctHash = lastBlock.hash === newBlock.previousBlockHash;
  const correctIndex = lastBlock['index'] + 1 === newBlock['index'];
  if (correctHash && correctIndex) {
    newcoin.chain.push(newBlock);
    newcoin.pendingTransactions = [];
    res.json({
      note: 'New block received and accepted',
      newBlock: newBlock
    });
  }
  else {
    res.json({
      note: 'New block rejected',
      newBlock: newBlock
    });
  } 
});

// mine new block
app.get('/mine', function(req, res) {
  const lastBlock = newcoin.getLastBlock();
  const previousBlockHash = lastBlock['hash'];
  const currentBlockData = {
    transactions: newcoin.pendingTransactions,
    index: lastBlock['index'] + 1
  };
  const nonce = newcoin.proofOfWork(previousBlockHash, currentBlockData);
  const blockHash = newcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
  const newBlock = newcoin.createNewBlock(nonce, previousBlockHash, blockHash);

  const requestPromises = [];
  newcoin.networkNodes.forEach(networkNodeUrl => {
    const requestOptions = {
      url: networkNodeUrl + '/receive-new-block',
      method: 'POST', 
      data: {newBlock: newBlock},
      json: true
    };
    requestPromises.push(axios(requestOptions));
  });

  Promise.all(requestPromises) 
  .then(data => {
    const requestOptions = {
      url: newcoin.currentNodeUrl + '/transaction/broadcast',
      method: 'POST',
      data: {
        amount: 12.5, 
        sender: "00",
        recipient: nodeAddress
      },
      json: true
    };
    return axios(requestOptions)
  }).then(data => {
    res.json({
      note: "new block mined successfully",
      block: newBlock
    }); 
  });
});

// register a node and broadcast it to the network
app.post('/register-and-broadcast-node', function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const notCurrentNode = newcoin.currentNodeUrl !== newNodeUrl;
  if (newcoin.networkNodes.indexOf(newNodeUrl) == -1 && notCurrentNode)
    newcoin.networkNodes.push(newNodeUrl);

  const regNodesPromises = [];
  newcoin.networkNodes.forEach(newtworkNodeUrl => {
    const requestOptions = {
      url: newtworkNodeUrl + '/register-node',
      method: 'POST',
      data: { newNodeUrl: newNodeUrl },
      json: true
    };
    regNodesPromises.push(axios(requestOptions));
  });
  Promise.all(regNodesPromises).then(data => {
    const bulkRegisterOptions = {
      url: newNodeUrl + '/register-nodes-bulk',
      method: 'POST',
      data: { allNetworkNodes: [...newcoin.networkNodes, newcoin.currentNodeUrl] },
      json: true
    };
    return axios(bulkRegisterOptions);
  }).then(data => {
    res.json({note: 'New node registered with network successfully.'});
  }); 
});

// register a node with the network
app.post('/register-node', function(req, res) {
  const newNodeUrl = req.body.newNodeUrl;
  const notCurrentNode = newcoin.currentNodeUrl !== newNodeUrl;
  if (newcoin.networkNodes.indexOf(newNodeUrl) == -1 && notCurrentNode)
    newcoin.networkNodes.push(newNodeUrl);
  res.json({note: 'New node registerd succesfully!'});
});

// register multiple nodes at once
app.post('/register-nodes-bulk', function(req, res) {
  const allNetworkNodes = req.body.allNetworkNodes;
  allNetworkNodes.forEach(newtworkNodeUrl => {
    const notCurrentNode = newcoin.currentNodeUrl !== newtworkNodeUrl;
    if (newcoin.networkNodes.indexOf(newtworkNodeUrl) == -1 && notCurrentNode)
      newcoin.networkNodes.push(newtworkNodeUrl);
  });
  res.json({note: 'Bulk registration successful.'});
});

// consensus
app.get('/consensus', function(req, res) {
	const requestPromises = [];
	newcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			url: networkNodeUrl + '/blockchain',
			method: 'GET',
			json: true
		};

		requestPromises.push(axios(requestOptions));
	});

	Promise.all(requestPromises)
	.then(blockchains => {
		const currentChainLength = newcoin.chain.length;
		let maxChainLength = currentChainLength;
		let newLongestChain = null;
		let newPendingTransactions = null; 

		blockchains.forEach(blockchain => {
			if (blockchain.data.chain.length > maxChainLength) {
				maxChainLength = blockchain.data.chain.length;
				newLongestChain = blockchain.data.chain;
				newPendingTransactions = blockchain.data.pendingTransactions;
			};
		});

		if (!newLongestChain || (newLongestChain && !newcoin.chainIsValid(newLongestChain))) {
			res.json({
				note: 'Current chain has not been replaced.',
				chain: newcoin.chain
			});
		}
		else {
			newcoin.chain = newLongestChain;
			newcoin.pendingTransactions = newPendingTransactions;
			res.json({
				note: 'This chain has been replaced.',
				chain: newcoin.chain
			});
		}
	});
});

app.get('/block/:blockHash', function(req, res) {
  const blockHash = req.params.blockHash;
  const correctBlock = newcoin.getBlock(blockHash);
  res.json({
    block: correctBlock
  });
});

app.get('/transaction/:transactionId', function(req, res) {
  const transactionId = req.params.transactionId;
  const correctTransaction = newcoin.getTransaction(transactionId);
  res.json({
    transaction: correctTransaction.transaction,
    block: correctTransaction.block
  });
});

app.get('/address/:address', function(req, res) {
  const address = req.params.address;
  const addressData = newcoin.getAddressData(address);
  res.json({
    addressData: addressData
  });
});

app.get('/block-explorer', function(req, res) {
  res.sendFile('./block-explorer/index.html', {root: __dirname});
});

 
app.listen(port, function() {
  console.log(`Listening on port ${port}...`)
});