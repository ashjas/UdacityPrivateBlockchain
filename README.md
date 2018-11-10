# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

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

## Testing

To test code:
1: Open a command prompt or shell terminal after install node.js.
2: Enter a node session, also known as REPL (Read-Evaluate-Print-Loop).
```
node
```
3: Copy and paste your code into your node session
4: Instantiate blockchain with blockchain variable
```
let blockchain = new Blockchain();
```
5: Generate 10 blocks using a for loop
```
for (var i = 0; i <= 10; i++) {
  blockchain.addBlock(new Block("test data "+i));
}
```
6: Validate blockchain
```
blockchain.validateChain();
```
7: Induce errors by changing block data
```
let inducedErrorBlocks = [2,4,7];
for (var i = 0; i < inducedErrorBlocks.length; i++) {
  blockchain.chain[inducedErrorBlocks[i]].data='induced chain error';
}
```
8: Validate blockchain. The chain should now fail with blocks 2,4, and 7.
```
blockchain.validateChain();
```

## Testing REST methods

This project supports two REST methods to query a block given a height,
and adding a block to the Blockchain.

1: Open a command prompt and start the server:
```
node serveRest.hs
```

2: Using a browser, one can query the details of a block giving the height as a parameter:
````
http://localhost:8000/block/14
````
The above command fetches the block at height 14 for example.

3: One can also add a block by issuing a POST request using Postman:
```
http://localhost:8000/add

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
* **Ashish Soni** - *Progressively implemented course projects * - [ashjas](https://github.com/ashjas)

## License

This project is licensed under the MIT License.

## Acknowledgments

* Udacity instructors
* Udacity Blockchain Nanodegree Course
