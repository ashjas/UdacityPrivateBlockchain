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
        return new Promise(function (resolve) {
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
                            console.log('json for getting previous hash:' + json['hash']);
                            newBlock.previousBlockHash = json['hash'];
                            // UTC timestamp
                            newBlock.time = new Date().getTime().toString().slice(0,-3);
                            // Block hash with SHA256 using newBlock and converting to a string
                            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                            // Adding block object to chain
                            return level.addDataToChain(JSON.stringify(newBlock).toString());
                        });
                    });
                }
                else{
                    // Add the newBlock
                    newBlock.height = height + 1;// block height is the block # at which its added.
                    level.getChainData(height).then( value => {
                        var json = JSON.parse(value);
                        console.log('json for getting previous hash:' + json['hash']);
                        newBlock.previousBlockHash = json['hash'];
                        // UTC timestamp
                        newBlock.time = new Date().getTime().toString().slice(0,-3);
                        // Block hash with SHA256 using newBlock and converting to a string
                        newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                        // Adding block object to chain
                        return level.addDataToChain(JSON.stringify(newBlock).toString());
                    });

                }
            }).catch((error) => { console.log('Exception in addBlock:' + error);});
        });
    }

    // validate block
    validateBlock(blockHeight){
        // get block object
        level.getChainData(blockHeight).then( value => {
            var json = JSON.parse(value);
            // get block hash
            let blockHash = json.hash;
            // remove block hash to test block integrity
            json.hash = '';
            // generate block hash
            let validBlockHash = SHA256(json);
            // Compare
            if (blockHash===validBlockHash) {
            } else {
                console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                reject();
            }

        });

    }

    // Validate blockchain
    validateChain(){
        let errorLog = [];
        level.getChainHeight().then(height => { return height;}).then( function(height){
            for (var i = 0; i <= height; i++) {
                level.getChainData(i).then( value => {
                    var json = JSON.parse(value);
                    let blockHash = json.hash;
                    json.hash = '';
                    let validBlockHash = SHA256(JSON.stringify(json).toString());
                    if (blockHash==validBlockHash) {
                    } else {
                        console.log('Block #'+json.height+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
                    }
                    let previousHash = json.previousBlockHash;
                }).then(height,previousHash => {
                    level.getChainData(height - 1).then( value => {
                        var json = JSON.parse(value);
                        let blockHash = json.hash;
                        if(blockHash !== previousBlockHash){
                            errorLog.push(i);
                        }
                    });
                });
            }
            if (errorLog.length>0) {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: '+errorLog);
            } else {
                console.log('No errors detected');
            }
        }).catch(error => {console.log('Exception in getChainHeight..:' + error);});
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

let Chain = new Blockchain();
        j=-1;

    theLoop: (function theLoop (i) {
        j++;
        var sequence = Promise.resolve();
        setTimeout(function () {
            sequence = sequence.then(() => {
            Chain.addBlock(new Block ('This is Block ' + j + ' Data'));
            if (--i) theLoop(i);
            });
        }, 100);
    })(10);
/**/
//level.printChain();
//getHeight();

        
//Chain.validateChain();
//Chain.addBlock(new Block('This is block data'));
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

