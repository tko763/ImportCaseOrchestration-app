'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var webhook_res=""
var app = express();
app.use(bodyParser.json());

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";


        if('data' in req.body[0]){
            if('validationCode' in req.body[0].data) {
              webhook_res = {'validationResponse': req.body[0].data.validationCode}
              context.log('Azure EventGrid subscription successfully validated')
              context.res.send(webhook_res);
            }
        else{     
              context.res = {
                // status: 200, /* Defaults to 200 */
                    body: responseMessage    };
            };
        };
    }