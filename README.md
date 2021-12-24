# blockchain
Adapted from 'Learn Blockchain Programming with JavaScript' book. [1] This repository emulates a proof-of-work bloackchain with a longest-chain consensus algorithm. It uses the expressjs library to build multiple network nodes that act as blockchain nodes andn emulaes the snchronization of a real-life blockchain. 

## Installation and Setup
This project requires `nodesjs` and `npm` installed as pre-requisites. 

After cloning into the library run `npm install` to install all the necessary libraries and dependencies. 
Once the dependencies have been installed network-nodes can be run using 
`node dev/networkNode.js port_number` 
Multiple network nodes can be run simultaneously and is recommended to observe the synchronization of the blockchain.

## Functionality
There are a few endpoints that can be hit to observe the synchronization of the entire blockchain. (We assume the port 3000)

1) `localhost:3000/blockchain` : to observe the entire bloackchain including the blocks mined, pending transactions, and nodes in the network. 
2) `localhost:3000/transaction/broadcast` : to create a new transaction and broadcast it to the entire network. 
   This endpoint requires the transaction details to be contained inside the post body in JSON format as 
   `
    {
    "amount": 40,
    "sender": "HSDUSHDUIHIUH",
    "recipient": "DGFYUDSGYUFG"
    }
   `


## References 
[1] Traub, E. (2018). Learn Blockchain programming with JavaScript: Build your very own blockchain and decentralized network with JavaScript and node.js. Packt. 
