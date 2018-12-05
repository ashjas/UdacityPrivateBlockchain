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

var blockData = `{
    "address": "1PUCpJWqEFpEc8oH8P9dARBbN5aGLVbNPf",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "416c6c20656e636f64696e67732066726f6d2074686520456e636f64696e672073706563696669636174696f6e2061726520737570706f727465643a7574662d382069626d3836362069736f2d383835392d322069736f2d383835392d332069736f2d383835392d342069736f2d383835392d352069736f2d383835392d362069736f2d383835392d372069736f2d383835392d382069736f2d383835392d382d692069736f2d383835392d"
    }
  
}`;


function populateChainWithBlocks(numOfBlocks){
    let Chain = new Blockchain.Blockchain();
    j=-1;
    theLoop: (function theLoop (i) {
        j++;
        var sequence = Promise.resolve();
        setTimeout(function () {
            sequence = sequence.then(() => {
                var data = JSON.parse(blockData);
            Chain.addBlock(new Block.Block (data));
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
//populateChainWithBlocks(5);
printChain();
//validateChain();
//induceErrorInChain();
