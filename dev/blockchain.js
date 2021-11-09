
const sha256 = require('js-sha256');
const { v4: uuidv4 } = require('uuid');

function Blockchain(url) {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = url;
    this.networkNodes = [];

    this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = 
    function(nonce, previousBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previousBlockHash: previousBlockHash
    };
    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length-1];
}

Blockchain.prototype.createNewTransaction = 
    function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuidv4().split('-').join('')
    };
    return newTransaction;
}

Blockchain.prototype.addTransactionToPendingTransactions = 
    function(transactionObj) {
    this.pendingTransactions.push(transactionObj);
    return this.getLastBlock()['index'] + 1;
};

Blockchain.prototype.hashBlock = 
    function(previousBlockHash, currentBlockData, nonce) {
    const dataAsString = previousBlockHash + nonce.toString() + 
        JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }
    return nonce;
}

Blockchain.prototype.chainIsValid = function(blockchain) {
    // let isValid = true;

    for (let i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i]
        const previousBlock = blockchain[i-1];
        const blockHash = this.hashBlock(previousBlock['hash'], 
            {transactions: currentBlock['transactions'], index: currentBlock['index']}, 
            currentBlock['nonce']);
        if (blockHash.substring(0, 4) !== '0000') return false;
        if (currentBlock['previousBlockHash'] !== previousBlock['hash']) return false;
    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
	const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
	const correctHash = genesisBlock['hash'] === '0';
	const correctTransactions = genesisBlock['transactions'].length === 0;

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) return false;
    return true;
}

Blockchain.prototype.getBlock = function(blockHash) {
    let hashBlock = null;
    this.chain.forEach(block => {
        if(block.hash === blockHash) hashBlock = block;
    });
    return hashBlock;
}

Blockchain.prototype.getTransaction = function(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;

    this.chain.forEach(block=>{
        block.transactions.forEach(transaction => {
            if (transaction.transactionId === transactionId) {
                correctTransaction = transaction;
                correctBlock = block;
            }
        });
    });
    return {
        transaction: correctTransaction,
        block: correctBlock
    };
}

Blockchain.prototype.getAddressData = function(address) {
    const allTransactions = [];
    let addressBalance = 0;

    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if (transaction.sender === address) {
                allTransactions.push(transaction);
                addressBalance -= transaction.amount;
            } else if (transaction.recipient === address) {
                allTransactions.push(transaction);
                addressBalance += transaction.amount;
            }
        });
    });

    return {
        addressTransactions: allTransactions,
        addressBalance: addressBalance
    };
}




module.exports = Blockchain;