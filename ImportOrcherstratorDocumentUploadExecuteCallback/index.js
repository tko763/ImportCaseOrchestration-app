const  MongoClient = require('../api/dbConnect');
const { config } = require('../config');
const { ObjectId } = require('mongodb')

module.exports = async function (context, eventGridEvent) {
    // NGROK URL
    // https://939e-103-108-95-110.ngrok.io/runtime/webhooks/EventGrid?functionname=ImportOrcherstratorDocumentUploadExecuteCallback
    
    const baseUrl = "https://importerinvoiceextractor.blob.core.windows.net/importerinvoice/";

    context.log(typeof eventGridEvent);
    context.log(eventGridEvent);

    // if  eventGridEvent.data.api = "PutBlob"  --- CREATE Case

    const fileName = eventGridEvent.data.url.replace(baseUrl,"");

    const caseId = fileName.split('_', 1);

    const mongoClient = await MongoClient;
        
    const db = await mongoClient.db(config.MONGO_DB);
    const collection = db.collection('calbackUrls');
    
   
    const callbackUrls = await collection.findOne({_id: ObjectId(caseId[0])});


    
    //const callbackUrl = await db.collection("calbackUrls").findOne({"_id":caseId});
    
    context.log("callback URL:" + callbackUrls.callbackUrl);

    callbackUrls.callbackUrl = "http://localhost:7072/api/readCase";

    if (callbackUrls) {
        const XMLHttpRequest = require('xhr2');
        const xhr = new XMLHttpRequest();
        xhr.open("POST", callbackUrls.callbackUrl);
        // set content-type header to JSON
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify("Document Uploaded"))
        // triggered when the response is fully received
        xhr.onload = function() {
            console.log("Call back triggered. Status:" + xhr.status);
        }

    }


};