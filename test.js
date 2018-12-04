var level = require('./levelSandbox');
var Block = require('./Block');
var Blockchain = require('./simpleChain');

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

function populateChainWithBlocks(numOfBlocks){
    let Chain = new Blockchain.Blockchain();
    j=-1;
    theLoop: (function theLoop (i) {
        j++;
        var sequence = Promise.resolve();
        setTimeout(function () {
            sequence = sequence.then(() => {
            Chain.addBlock(new Block.Block ('This is Block ' + j + ' Data'));
            if (--i) theLoop(i);
            });
        }, 100);
    })(numOfBlocks);
}

//helper function for inducing error.
function putModifiedBlock(data)
{
    return new Promise(function (resolve) {
        var json = JSON.parse(data[1]);
        console.log(json);
        json.data = 'induced chain error';
        var val = JSON.stringify(json).toString();
        console.log('idx,val:' + data[0] + ',' + val);
        level.addChainData(data[0],val);
    });
}

function printChain(){
    let Chain = new Blockchain.Blockchain();
    Chain.printChain();
}

function induceErrorInChain() {
    let Chain = new Blockchain.Blockchain();
    let inducedErrorBlocks = [2,4,7];
    var sequence = Promise.resolve();
    for (var i = 0; i < inducedErrorBlocks.length; i++) {
        var idx = inducedErrorBlocks[i];
        Chain.getBlock(idx).then(value => {
            return [idx,value];
        }).then(putModifiedBlock).catch(error => { console.log(error) })
    }
}

function validateChain(){
    let Chain = new Blockchain.Blockchain();
    Chain.validateChain();
}

// Calls for running tests..
populateChainWithBlocks(5);
//printChain();
//validateChain();
//induceErrorInChain();
