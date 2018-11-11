# Simple Private Blockchain

Blockchain has the potential to change the way that the world approaches data. 
This project implements a simple blockchain, in javascript, and provides a way to add/query/validate blocks in the simple blockchain.
Referring this project,one can develop Blockchain skills by understanding the data model behind Blockchain by developing your own
simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install crypto-js with --save flag to save dependency to our package.json file
```
npm install crypto-js --save
```
- Install level with --save flag
```
npm install level --save
```
- Install hapi framework with --save flag
```
npm install hapi --save
```

## Testing Prerequisites

In order to test this project, after cloning the project, one has to add data to the Blockchain on which tests
can be performed.

Issue the following command:
```
node test.js
```

This test script, has few helper functions.
```
populateChainWithBlocks(numOfBlocks);
printChain();
validateChain();
induceErrorInChain();
```
Upon first use, the blockchain is populated with dummy data using the 'populateChainWithBlocks' call.
Thereafter, the one can play with other helper functions to interact with the blockchain. Call/remove these
functions from the test.js script as needed to test the blockchain.

## Testing REST methods

This project supports two REST methods to query a block given a height,
and adding a block to the Blockchain.

### Available Endpoints

#### GET Endpoints

##### Get a Block at specific height
```
http://localhost:8000/block/4
```


#### POST Endpoints

##### Add a block to the chain.
```
http://localhost:8000/block
```
###### Parameters
```
{
    "body":"Some data example"
}
```

### Steps to test REST methods

1: Open a command prompt and start the server:
```
node serveRest.js
```

2: Using a browser, one can query the details of a block giving the height as a parameter:
````
http://localhost:8000/block/14
````
The above command fetches the block at height 14 for example.

3: One can also add a block by issuing a POST request using Postman:
```
http://localhost:8000/block

add the block data in the command body in this format:
{
    "body":"Some data example"
}
```
## Built With

* [nodejs](https://nodejs.org/en/) - The javascript framework used.
* [Hapi](https://hapijs.com/) - A rich framework for building applications and services.
* [LevelDB](http://leveldb.org/) - A light-weight, single-purpose library for persistence.
* [crypto-js](https://www.npmjs.com/package/crypto-js) - JavaScript library of crypto standards.

## Authors

* **Udacity** - *Initial template provided by Udacity* - [Udacity](https://github.com/udacity)
* **Ashish Soni** - *Progressively implemented course projects* - [ashjas](https://github.com/ashjas)

## License

This project is licensed under the MIT License.

## Acknowledgments

* Udacity instructors
* Udacity Blockchain Nanodegree Course
* Code samples provided by nodejs,levelDB,hapi and crypto-js libraries