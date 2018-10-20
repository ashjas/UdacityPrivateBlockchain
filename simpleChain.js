/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
var level = require('./levelSandbox');


/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
	constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
    constructor(){
    }

    // Add new block
    addBlock(newBlock){
        // add the genesis Block if chain is empty, before adding a new block.

        level.getChainHeight().then(height => { return height;}).then( function(height){
            console.log('Height:' + height);
            if(height === -1 ) {// add a genesis block.
                console.log('adding the Genesis block.' );
                var genesisBlock = new Block('Genesis Block');
                // UTC timestamp
                genesisBlock.time = new Date().getTime().toString().slice(0,-3);
                // Block hash with SHA256 using Block and converting to a string
                genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
                // Adding block object to chain
                level.addDataToChain(JSON.stringify(genesisBlock).toString()).then(() => {
                    // Add the newBlock
                    newBlock.height = height + 1;// block height is the block # at which its added.
                    level.getChainData(height).then( value => {
                        var json = JSON.parse(value);
                        newBlock.previousBlockHash = json['hash'];
                    });
                    // UTC timestamp
                    newBlock.time = new Date().getTime().toString().slice(0,-3);
                    // Block hash with SHA256 using newBlock and converting to a string
                    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                    // Adding block object to chain
                    level.addDataToChain(JSON.stringify(newBlock).toString());
                });
            }
            else{
                // Add the newBlock
                newBlock.height = height + 1;// block height is the block # at which its added.
                level.getChainData(height).then( value => {
                    var json = JSON.parse(value);
                    newBlock.previousBlockHash = json['hash'];
                });

                // UTC timestamp
                newBlock.time = new Date().getTime().toString().slice(0,-3);
                // Block hash with SHA256 using newBlock and converting to a string
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                // Adding block object to chain
                level.addDataToChain(JSON.stringify(newBlock).toString());
            }
        }).catch((error) => { console.log('Exception in addBlock:' + error)}
        );
    }

    // validate block
    validateBlock(blockHeight){
        // get block object
        let block = level.getChainData(blockHeight);
        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash===validBlockHash) {
            return true;
        } else {
            console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
            return false;
        }
    }

    // Validate blockchain
    validateChain(){
        let errorLog = [];
        for (var i = 0; i <= level.getChainHeight(); i++) {
            // validate block
            if (!this.validateBlock(i))errorLog.push(i);
            // compare blocks hash link
            let blockHash = level.getChainData(i).hash;
            let previousHash = level.getChainData(i+1).previousBlockHash;
            if (blockHash!==previousHash) {
                errorLog.push(i);
            }
        }
        if (errorLog.length>0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: '+errorLog);
        } else {
            console.log('No errors detected');
        }
    }
    printChain(){
        level.printChain();
    }

}
function getHeight(){
        level.getChainHeight().then(height => { return height;}).then( function(height){
            console.log('Height: ' + height);
        });
}

    /* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/
/*
let Chain = new Blockchain();
    theLoop: (function theLoop (i) {
        setTimeout(function () {
            Chain.addBlock('This is Block ' + i + ' Data');
            if (--i) theLoop(i);
        }, 100);
    })(10);
/**/
let Chain = new Blockchain();
//Chain.addBlock(new Block('This is block data'));
getHeight();
//Chain.addBlock(new Block('This is block data'));
//console.log('initialized chain\n');
//console.log('Going to query added block now..\n');
/*let promise_= level.getChainHeight2();
promise_.then(height => {
    console.log( 'Height: ' + height);
});/**/
//getHeight().then(height => { console.log( 'Height: ' + height);})
/*
level.getChainHeight().then(height => { console.log( 'Height: ' + height);}).then( function(){
console.log('aaaa');
console.log('aaaa');
console.log('aaaa');
console.log('aaaa');
console.log('aaaa');
});/**/
//console.log('Chain Height: ' + getHeight());
//console.log( 'Heighttttt: ' + level.getChainHeight());
//Chain.validateChain();
//console.log('validated chain\n');
//Chain.printChain();

