'use strict';

var Blockchain = require('./simpleChain');
var Block = require('./Block');
var ChainPool = require('./chainMempool');

const Hapi=require('hapi');
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
            return JSON.parse(out);
        }
        catch(error) {
            return new restERROR(1501,'Invalid Block height parameter:'+ request.params.height).getJson();
        }
    }
},
{
    method: 'POST',
    path: '/block',
    handler: async function (request, h) {
        try {
            let Chain = new Blockchain.Blockchain();
            var blockData = request.payload.body;
            var walletAddress = request.payload.walletAddress;
            if (blockData) {
                if (MemPool.isAuthorized(walletAddress)) {
                    var out = await Chain.addBlock(new Block.Block(blockData));
                    return JSON.parse(out);
                }
                else
                    return new restERROR(1502, 'Not authorized to add a block.').getJson();
            }
            else
                return new restERROR(1503, 'Request parameter does not have \'body\' field, which is required for adding a block.').getJson();
        }
        catch (error) {
            return 'Exception in POST handler: ' + error;
        }
    }
},
{
    method: 'POST',
    path: '/requestValidation',
    handler:async function(request,h) {
        try {
            var walletAddress = request.payload.walletAddress;
            if(walletAddress){
                var out = await MemPool.addReqToPool(new ChainPool.validationRequest(walletAddress));
                return JSON.parse(out);
            }
            else
                return new restERROR(1504,'Request parameter does not have \'walletAddress\' field, which is required for adding a block.').getJson();
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
            if(signature){
                var out = await MemPool.verifySignedMessage(request.payload);
                return JSON.parse(out);
            }
            else
                return new restERROR(1505,'Request parameter does not have \'signature\' field, which is required for adding a block.').getJson();
        }
        catch(error) {
            return 'Exception in POST handler: ' + error;          
        }
    }
}
]);

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
