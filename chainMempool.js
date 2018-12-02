/* ===== Mempool Class ==============================
|  Class with a constructor for chain Mempool 	    |
|  ===============================================*/

var bitcoinMessage = require('bitcoinjs-message');
var validationWindow = 60;
class validationRequest {
    constructor(address) {
        this.address = address;
        this.timeStamp = new Date().getTime().toString().slice(0, -3);
        this.message = this.address + ':' + this.timeStamp + ':' + 'starRegistry';
        this.authorized = false;
    }
}
class MemPool {
    constructor(data) {
        this.memPool = [];
    }

    addReqToPool(req) {
        let response;
        var alreadyAuthorized = false;
        var found = this.memPool.some(function (element) {
            if (element.address == req.address) {
                if (element.authorized == false)
                    element = req;//same wallet request rewrites the previous validation request.
                else
                    alreadyAuthorized = true;
                return true;
            }
            return false;
        });
        if (!found) {
            this.memPool.push(req);
            console.log('pushed new to mempool');
        }
        if (alreadyAuthorized == false) {
            response = {
                address: req.address,
                message: req.message,
                requestTimestamp: req.timeStamp,
                validationWindow: validationWindow - (new Date().getTime().toString().slice(0, -3) - req.timeStamp)
            };
        }
        else {
            response = {
                message: 'Authorized request already pending in mempool. You can register a star.'
            };
        }
        return JSON.stringify(response);
    }
    isAuthorized(walletAddress) {
        var idx = 0;
        var obj = this;
        return this.memPool.some(function (element) {
            if (element.address == walletAddress && element.authorized) {
                obj.memPool.splice(idx, 1);//New star will be registered in blockchain,so now remove the validated request from mempool
                console.log('Removed validated req, mempool size: ' + obj.memPool.length);
                return true;
            }
            idx++;
            return false;
        });
    }
    verifySignedMessage(msg) {
        let response;
        var idx = 0;
        var obj = this;
        var found = this.memPool.some(function (element) {
            if (element.address == msg.walletAddress && element.authorized) {
                response = {
                    message: 'You are already authorized to register a star, skipping signature verification.'
                };
                return true;
            }
            else if (element.address == msg.walletAddress) {
                if ((validationWindow - (new Date().getTime().toString().slice(0, -3) - element.timeStamp)) > 0) {//within validation window.
                    if (bitcoinMessage.verify(element.message, msg.walletAddress, msg.signature)) {
                        element.authorized = true;
                        response = {
                            message: 'Verification Success. Can proceed to register a Star.'
                        };
                    }
                    else {
                        response = {
                            message: 'Verification Failed, check your signature. You can\'t register a Star.'
                        };
                    }
                }
                else {// Remove the validation request if window expired.
                    obj.memPool.splice(idx, 1);
                    response = {
                        message: 'Validation window expired, add another request to mempool before verification.'
                    };
                }
                return true;
            }
            idx++;
            return false;
        });
        if (!found) {
            response = {
                message: 'Request not available in mempool.'
            };
        }
        return JSON.stringify(response);
    }
}

module.exports.MemPool = MemPool;
module.exports.validationRequest = validationRequest;