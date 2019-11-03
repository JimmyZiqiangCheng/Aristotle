/*jshint esversion: 8 */ 
const request = require('request-promise');

function requestPromise(options) {
    return new Promise((resolve, reject) => {
        request(options)
        .then(data => resolve(data))
        .catch(err => reject({
            statusCode: err.statusCode,
            message: err.message
        }));
    });
}

module.exports.get = function get(uri, qs) {
    let options = {
        method: 'GET',
        uri: uri,
        json: true
        // JSON stringifies the body automatically
    };
    if(qs) {
        options.qs = qs
    }
    return requestPromise(options);
};


module.exports.post = function post(uri, payload) {
    const options = {
        method: 'POST',
        uri: uri,
        json: true,
        body: payload
        // JSON stringifies the body automatically
    };
    return requestPromise(options);
};

module.exports.put = function put(uri, payload) {
    const options = {
        method: 'PUT',
        uri: uri,
        json: true,
        body: payload
        // JSON stringifies the body automatically
    };
    return requestPromise(options);
};