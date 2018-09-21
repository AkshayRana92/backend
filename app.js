const express = require('express');
const request = require('request');
const OAuth   = require('oauth-1.0a');
const crypto  = require('crypto');

// Mock API to store token at server side to get the data
const app_data = {
    key: 'v2h66av54e3pitgv53g01r8423',
    secret: '8q37af3p9m24imiosq7m40qgfq'
};
// oauth_token=a636a534030a4214b1e07c7ba11a46bf&oauth_token_secret=2a42975046ac4bde9eb0dbab2ce6c505&oauth_callback_confirmed=true
// oauth_verifier=290dfeb5e8f94caaa2ac10e6287f52a3

const token = {
    key: 'f556f38a9cf54ca4974c66ef4deec902',
    secret: '270f82a6884841fe854383c84cfed99e'
};
const app = express();

const meterId = 'EASYMETER_1024000034';
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/power', (req, res) => {
    console.log('power GET called');
    const oauth = OAuth({
        consumer: {
            key: app_data.key,
            secret: app_data.secret
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }
    });

    let toTime = req.query.to;
    let fromTime = req.query.from;

    console.log(`https://api.discovergy.com/public/v1/readings?meterId=${meterId}&from=${fromTime}&to=${toTime}&fields=power,energy`)
    const request_data = {
        url: `https://api.discovergy.com/public/v1/readings?meterId=${meterId}&from=${fromTime}&to=${toTime}&fields=power,energy`,
        method: 'GET'
    };

    request({
        url: request_data.url,
        method: request_data.method,
        form: request_data.data,
        headers: oauth.toHeader(oauth.authorize(request_data, token))
    }, function(error, response, body) {
        if(error) {
            console.log(error);
            res.sendStatus(error.statusCode).send(error)
        } else {
            res.send(body)
        }
    });
});

app.get('/power/last', (req, res) => {
    console.log('power Last Reading GET called');
    const oauth = OAuth({
        consumer: {
            key: app_data.key,
            secret: app_data.secret
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }
    });

    const request_data = {
        url: `https://api.discovergy.com/public/v1/last_reading?meterId=${meterId}&fields=power,energy`,
        method: 'GET'
    };

    request({
        url: request_data.url,
        method: request_data.method,
        form: request_data.data,
        headers: oauth.toHeader(oauth.authorize(request_data, token))
    }, function(error, response, body) {
        if(error) {
            console.log(error);
            res.sendStatus(error.statusCode).send(error)
        } else {
            res.send(body)
        }
    });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));