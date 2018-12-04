'use strict';

var Blockchain = require('./simpleChain');
var Block = require('./Block');
var ChainPool = require('./chainMempool');
const Hapi = require('hapi');
const TextEncoder = require('text-encoding');
var hex2ascii = require('hex2ascii');
var MemPool = new ChainPool.MemPool();

class restERROR{
    constructor(code, msg) {
        this.code = code,
        this.message = msg
    }
    getJson(){
        let error = {
            error: {
                code: this.code,
                message: this.message
            }
        };
        return JSON.parse(JSON.stringify(error));
    }
}

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

// Add the route
server.route([{
    method:'GET',
    path:'/block/{height}',
    handler:async function(request,h) {
        try{
            let Chain = new Blockchain.Blockchain();
            var out =  await Chain.getBlock(encodeURIComponent(request.params.height));
            var jsonOut = JSON.parse(out);
            jsonOut.body.star.storyDecoded = hex2ascii(jsonOut.body.star.story);
            return jsonOut;
        }
        catch(error) {
            return new restERROR(1501,'Request Failed with height parameter:'+ request.params.height + 'error: ' + error).getJson();
        }
    }
},
{
    method:'GET',
    path:'/stars/hash:{hash}',
    handler:async function(request,h) {
        try{
            let Chain = new Blockchain.Blockchain();
            var out =  await Chain.getBlockByHash(encodeURIComponent(request.params.hash));
            var jsonOut = JSON.parse(out);
            jsonOut.body.star.storyDecoded = hex2ascii(jsonOut.body.star.story);
            return jsonOut;
        }
        catch(error) {
            return new restERROR(1502,'Request Failed with hash parameter:'+ request.params.hash + 'error: ' + error).getJson();
        }
    }
},
{
    method:'GET',
    path:'/stars/address:{address}',
    handler:async function(request,h) {
        try{
            let Chain = new Blockchain.Blockchain();
            var jsonObjArray =  await Chain.getBlockByAddress(encodeURIComponent(request.params.address));
            for(var i = 0; i < jsonObjArray.length; ++i)
            {
                jsonObjArray[i].body.star.storyDecoded = hex2ascii(jsonObjArray[i].body.star.story);
            }            
            return jsonObjArray;
        }
        catch(error) {
            return new restERROR(1503,'Request Failed with address parameter:'+ request.params.address + 'error: ' + error).getJson();
        }
    }
},
{
    method: 'POST',
    path: '/block',
    handler: async function (request, h) {
        try {
            let Chain = new Blockchain.Blockchain();
            var walletAddress = request.payload.address;
            if (walletAddress
                && request.payload.star
                && request.payload.star.dec
                && request.payload.star.ra
                && request.payload.star.story) {
                if (MemPool.isAuthorized(walletAddress)) {
                    if(new TextEncoder.TextEncoder('utf-8').encode(request.payload.star.story).length > 500){
                        return new restERROR(1504, 'Story length should be less than 500 bytes. Skipping Block addition!').getJson();
                    }
                    var out = await Chain.addBlock(new Block.Block(request.payload));
                    var jsonOut = JSON.parse(out);
                    return jsonOut;
                }
                else
                    return new restERROR(1505, 'Not authorized to add a block. Post a request and validate with signature for address: ' + walletAddress).getJson();
            }
            else
                return new restERROR(1506, 'Request parameter does not have proper star registry format. Recheck request.').getJson();
        }
        catch (error) {
            return 'Exception in POST /block handler: ' + error;
        }
    }
},
{
    method: 'POST',
    path: '/requestValidation',
    handler:async function(request,h) {
        try {
            var walletAddress = request.payload.address;
            if(walletAddress){
                var out = await MemPool.addReqToPool(new ChainPool.validationRequest(walletAddress));
                return JSON.parse(out);
            }
            else
                return new restERROR(1507,'Request parameter does not have \'address\' field, which is required for adding a block.').getJson();
        }
        catch(error) {
            return 'Exception in POST handler: ' + error;          
        }
    }
},
{
    method: 'POST',
    path: '/message-signature/validate',
    handler:async function(request,h) {
        try {
            var signature = request.payload.signature;
            var address = request.payload.address;
            if(signature && address){
                var out = await MemPool.verifySignedMessage(request.payload);
                return JSON.parse(out);
            }
            else
                return new restERROR(1508,'Request parameter does not have \'signature\' field, which is required for adding a block.' + 'error: ' + error).getJson();
        }
        catch(error) {
            return 'Exception in POST handler: ' + error;          
        }
    }
}]);

// Start the server
async function start() {

    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
