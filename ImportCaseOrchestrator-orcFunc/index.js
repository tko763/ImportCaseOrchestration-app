/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 */

const df = require("durable-functions");


module.exports = df.orchestrator(function*(context) {

    const outputs = [];
    
    const caseId = context.df.getInput();
    
    if (!caseId) {
        throw Error("A Case Id input is required.");
    }

    const instanceId = context.df.instanceId;

    //   const caseCreated = yield context.df.callSubOrchestrator.   callActivity("E4_SendSmsChallenge", phoneNumber);
    yield context.df.callActivity("ImportCaseOrchestrator-actFunc-CreateCase", {'caseId':caseId, 'instanceId':instanceId});


    const event1 = context.df.waitForExternalEvent("EventGetBiconConditions");
    const event2 = context.df.waitForExternalEvent("EventGetCertNumber");
    const event3 = context.df.waitForExternalEvent("EventGetFIDLikeData");

    const event = yield context.df.Task.any([event1, event2, event3]);
    if (event === event1) {
        outputs.push(yield context.df.callActivity("ImportCaseOrchestrator-actFunc", "event"));
    } else if (event === event2) {
        outputs.push(yield context.df.callActivity("ImportCaseOrchestrator-actFunc", "event"));
    } else if (event === event3) {
        outputs.push(yield context.df.callActivity("ImportCaseOrchestrator-actFunc", "event"));
    }


// `input` here is retrieved from the Orchestrator function `callActivity` input parameter
// var input = context.bindings.input;




    //context.bindings.message = {
    //    body: `The weather's clear outside! Go take a walk!`,
    //    to: phoneNumber,
    //};
    


    // context.df.setCustomStatus("xxxxxxxxx");
    //context.df.setCustomStatus({
    //    discount,
    //    discountTimeout = 60,
    //    bookingUrl = "https://www.myawesomebookingweb.com",
    //});


    return outputs;
});