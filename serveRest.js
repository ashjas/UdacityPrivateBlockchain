'use strict';

var Blockchain = require('./simpleChain');
var Block = require('./Block');

const Hapi=require('hapi');

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
            var json = JSON.stringify(JSON.parse(out));
            return json;
        }
        catch(error) {
            //return error.message;
            return 'Invalid Block: ' + request.params.height;
        }
    }
},
{
    method: 'POST',
    path: '/add',
    handler:async function(request,h) {
        try {
            let Chain = new Blockchain.Blockchain();
            var blockData = JSON.parse(request.payload)['body'];
            if(blockData){
                var out = await Chain.addBlock(new Block.Block(blockData));
                return out;
            }
            else
                return 'Request does not have \'body\' field, which is required for adding a block.';
        }
        catch(error) {
            return 'Error in adding Block. ' + error;          
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
