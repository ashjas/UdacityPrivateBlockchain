# Private Blockchain Notary Service

Blockchain has the potential to change the way that the world approaches data. 
This project implements a blockchain notary service, in javascript, and provides a way to add/query/validate blocks with star data in the private blockchain.
Referring this project,one can develop Blockchain skills by understanding the data model behind Blockchain by developing your own private blockchain notary service.

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
- Install bitcoinjs-message framework with --save flag
```
npm install bitcoinjs-message --save
```
- Install hex2ascii framework with --save flag
```
npm install hex2ascii --save
```
- Install text-encoding framework with --save flag
```
npm install text-encoding --save
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

This project supports REST methods to query a block(s) given a height/hash/address
and adding a blocks to the Blockchain with star registry data.

### Available Endpoints

#### GET Endpoints

##### Get a Block at specific height
```
http://localhost:8000/block/4
```
##### Get a Block by its hash
```
http://localhost:8000/stars/hash:{hash}
```
##### Get all blocks added by a specific address
```
http://localhost:8000/stars/address:{address}
```

#### POST Endpoints

##### Post a validation request for star registration.
```
http://localhost:8000/requestValidation
```
###### Parameters
```
{
    "address":"1PUCpJWqEFpEc8oH8P9dARBbN5aGLVbNPf"
}
```
###### Output
```
{
    "address": "1PUCpJWqEFpEc8oH8P9dARBbN5aGLVbNPf",
    "message": "1PUCpJWqEFpEc8oH8P9dARBbN5aGLVbNPf:1543757535:starRegistry",
    "requestTimestamp": "1543757535",
    "validationWindow": 60
}
```

##### Authorize yourself by posting a signed message using your favourite bitcoin wallet(e.g Electrum).
```
http://localhost:8000/message-signature/validate
```
###### Parameters
Use the "message" field value from the output of /requestValidation POST query, sign this message and use this in 
the "signature" field parameter of this POST request.
```
{
    "address" : "1PUCpJWqEFpEc8oH8P9dARBbN5aGLVbNPf",
	"message"       : "1EsirC7HcF9geJzGLyrfX2zTQh6T2ZJ5FH:1543663627:starRegistry",
	"signature"     : "H3ZNELL1MxsnmzVYMeBy5t87Ka6ZmpGO82+4Cf/QMjGQWs8EWuehc0Gwj6fuki/8pa8Vhs6Rm9jpPZR5wdmXIyY="
}
```
A success message is recieved if signature is verified.
###### Output
```
{
    "message": "Verification Success. Can proceed to register a Star."
}
```

##### Add a block with star registry data to the chain.
User can add a block in star registry, if the signature is already verified using above POST requests.
Note: The story field's value is limited to 500 bytes in ASCII text or hex encoded.
```
http://localhost:8000/block
```
###### Parameters
```
{
    "body": {
    "address": "1PUCpJWqEFpEc8oH8P9dARBbN5aGLVbNPf",
    "star": {
      "ra": "1h 29m 1.0s",
      "dec": "-36° 19' 27.9",
      "story": "This is a sample story."
    }
  }
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
3: POST a validation request:
````
http://localhost:8000/requestValidation
body parameter format:
{
    "address":"1PUCpJWqEFpEc8oH8P9dARBbN5aGLVbNPf"
}
````
4: Verify the signature:
````
http://localhost:8000/message-signature/validate
body parameter format:
{
    "address" : "1PUCpJWqEFpEc8oH8P9dARBbN5aGLVbNPf",
	"message"       : "1EsirC7HcF9geJzGLyrfX2zTQh6T2ZJ5FH:1543663627:starRegistry",
	"signature"     : "H3ZNELL1MxsnmzVYMeBy5t87Ka6ZmpGO82+4Cf/QMjGQWs8EWuehc0Gwj6fuki/8pa8Vhs6Rm9jpPZR5wdmXIyY="
}
````
5: Add a block by issuing a POST request using Postman:
```
http://localhost:8000/block
body parameter format:
{
    "body": {
    "address": "1PUCpJWqEFpEc8oH8P9dARBbN5aGLVbNPf",
    "star": {
      "ra": "1h 29m 1.0s",
      "dec": "-36° 19' 27.9",
      "story": "This is a sample story."
    }
  }
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