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
    getValidationWIndow(timeStamp){
        return (validationWindow - (new Date().getTime().toString().slice(0, -3) - timeStamp));
    }
    isValidationWindowExpired(timeStamp){
        return ( this.getValidationWIndow(timeStamp) <= 0 );
    }
    addReqToPool(req) {
        let response;
        var alreadyAuthorized = false;
        var idx = 0; var obj = this;
        var found = this.memPool.some(function (element) {
            if (element.address == req.address) {
                if (!obj.isValidationWindowExpired(element.timeStamp)) {
                    if (element.authorized == false)
                        req = element;
                    else
                        alreadyAuthorized = true;
                    return true;
                }
                else {// found but window expired.
                    obj.memPool.splice(idx, 1);
                }
            }
            idx++;
            return false;
        });
        if (!found) {
            this.memPool.push(req);
            console.log('pushed new to mempool');
        }
        if (alreadyAuthorized == false) {
            response = {
                address: req.address,
                requestTimestamp: req.timeStamp,
                message: req.message,
                validationWindow: obj.getValidationWIndow(req.timeStamp)
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
            if (element.address == msg.address && element.authorized) {
                response = {
                    message: 'You are already authorized to register a star, skipping signature verification.'
                };
                return true;
            }
            else if (element.address == msg.address) {
                if (!obj.isValidationWindowExpired(element.timeStamp)) {//within validation window.
                    if (bitcoinMessage.verify(element.message, msg.address, msg.signature)) {
                        element.authorized = true;
                        response = {
                            registerStar: true,
                            status: {
                                address: element.address,
                                requestTimestamp: element.timeStamp,
                                message: element.message,
                                validationWindow: obj.getValidationWIndow(element.timeStamp),
                                messageSignature: 'valid'
                            }
                        };
                    }
                    else {
                        response = {
                            registerStar: false,
                            status: {
                                address: element.address,
                                requestTimestamp: element.timeStamp,
                                message: element.message,
                                validationWindow: obj.getValidationWIndow(element.timeStamp),
                                messageSignature: 'invalid'
                            }
                        };
                    }
                }
                else {// Remove the validation request if window expired.
                    obj.memPool.splice(idx, 1);
                    response = {
                        message: 'Validation window expired, add another request to mempool before verification.'
                    };
                    response = {
                        registerStar: false,
                        status: {
                            address: element.address,
                            requestTimestamp: element.timeStamp,
                            message: element.message,
                            validationWindow: 'expired',
                            messageSignature: 'validation skipped due to window expiry'
                        }
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