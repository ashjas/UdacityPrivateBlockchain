/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

module.exports = {
    // Add data to levelDB with key/value pair
    addChainData : function addChainData(key,value){
        return new Promise(function (resolve,reject) {
            console.log('going to put..');
            db.put(key, value, function(err) {
                if (err) return console.log('Block ' + key + ' submission failed', err);
                db.get(key,function(err,value) {
                    resolve();
                    //return console.log('Added block with key: ' + key + ' Value: ' + value);
                })
            })
        });
    },

    // Get data from levelDB with key
    getChainData : function getChainData(key){
        return new Promise(function (resolve,reject) {
        db.get(key, function(err, value) {
            if (err) return console.log('Not found!', err);
            console.log('Value = ' + value);
            resolve(value);
        })
        });
    },

    // Add data to levelDB with value
    addDataToChain : function addDataToChain(value) {
        return new Promise(function (resolve,reject) {
            let i = 0;
            db.createReadStream().on('data', function(data) {
                i++;
            }).on('error', function(err) {
                //return console.log('Unable to read data stream!', err)
            }).on('close', function() {
                console.log('going to add Block #' + i);
                return module.exports.addChainData(i, value);
            });
        });
    },
    getChainHeight : function getChainHeight() {
        return new Promise(function (resolve,reject) {
            let i = 0;
            db.createReadStream().on('data', function(data) {
                i++;
            }).on('error', function(err) {
                return console.log('Unable to read data stream!', err)
            }).on('close', function() {
                resolve( i-1 );
            });
        });
    },
    printChain : function printChain() {
        let i = 0;
        console.log('Printing Chain Data:');
        console.log('Chain Height: ' + module.exports.getChainHeight());
        db.createReadStream().on('data', function(data) {
            let block = data.value;
            console.log('Block height: ' + block.height);
            console.log('Block hash: ' + block.hash);
            console.log('Block previousBlockHash: ' + block.previousBlockHash);
            console.log('Block body: ' + block.body);
            i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        });
    }
};
