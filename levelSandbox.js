/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
var hex2ascii = require('hex2ascii');
const db = level(chainDB);

function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

module.exports = {
    // Add data to levelDB with key/value pair
    addChainData : function addChainData(key,value){
        return new Promise(function (resolve,reject) {
            console.log('going to put..');
            db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed');
                    reject(err);
                }
                db.get(key,function(err,value) {
                    console.log('Added block with key: ' + key + ' Value: ' + value);
                    resolve(value);
                })
            })
        });
    },

    // Get data from levelDB with key
    getChainData : function getChainData(key){
        return new Promise(function (resolve,reject) {
            db.get(key, function(err, value) {
                if (err) //return console.log('Not found!', err);
                    reject(err);
                //console.log('Value = ' + value);
                var jsonData = JSON.parse(value);
                if (isASCII(hex2ascii(jsonData.body.star.story))) {
                    jsonData.body.star.story = hex2ascii(jsonData.body.star.story);
                }
                resolve(jsonData);
            })
        });
    },

    // Get data from levelDB with block's hash
    getChainDataByHash : function getChainDataByHash(hash){
        return new Promise(function (resolve) {
            db.createReadStream().on('data', function(data) {
                let json = JSON.parse(data.value);
                if(json['hash'] == hash)
                {
                    var jsonData = JSON.parse(data.value);
                    if (isASCII(hex2ascii(jsonData.body.star.story))) {
                        jsonData.body.star.story = hex2ascii(jsonData.body.star.story);
                    }
                    resolve(jsonData);
                }
            }).on('error', function(err) {
                return console.log('Unable to read data stream!', err)
            }).on('close', function() {
                resolve('Not found by hash');
            });
        });
    },

    // Get all block data from levelDB with a given walletAddress
    getChainDataByAddress : function getChainDataByAddress(walletAddress){
        return new Promise(function (resolve) {
            var blockArray = new Array();
            db.createReadStream().on('data', function(data) {
                let json = JSON.parse(data.value);
                if(json['body']['walletAddress'] == walletAddress)
                {
                    var jsonData = JSON.parse(data.value);
                    if (isASCII(hex2ascii(jsonData.body.star.story))) {
                        jsonData.body.star.story = hex2ascii(jsonData.body.star.story);
                    }
                    blockArray.push(jsonData);
                }
            }).on('error', function(err) {
                return console.log('Unable to read data stream!', err)
            }).on('close', function() {
                resolve(blockArray);
            });
        });
    },

    // Add data to levelDB with value
    addDataToChain : function addDataToChain(value) {
        return new Promise(function (resolve,reject) {
            let i = 0;
            db.createReadStream().on('data', function(data) {
                i++;
            }).on('error', function(err) {
                console.log('Unable to read data stream!', err);
                reject(err);
            }).on('close', function() {
                console.log('going to add Block #' + i);
                module.exports.addChainData(i, value).then(value =>{
                    resolve(value);
                });
            });
        });
    },
    getChainHeight : function getChainHeight() {
        return new Promise(function (resolve) {
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
        console.log('--------------------');
        db.createReadStream().on('data', function(data) {
            let json = JSON.parse(data.value);
            console.log('');
            console.log('Block height: ' + json['height']);
            console.log('Block hash: ' + json['hash']);
            console.log('Block previousBlockHash: ' + json['previousBlockHash']);
            console.log('Block body: ' + json['body']);
            i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        });
    }
};
