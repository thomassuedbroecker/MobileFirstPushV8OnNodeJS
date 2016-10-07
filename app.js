/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

//******************************************************************************
// Variables for the Module Usage - Push with MobileFirstFoundation service
var mfpAppName = 'com.tsuedbro.mytravelblog';//'YOUR APPLICATION NAME sample (com.tsuedbro.mytravelblog)';
var mfpScopeUser = "test"; //"YOUR SCOPE USER sample (test)";
var mfpScopePW = "test";//"YOUR SCOPE USER PASSWORD  sample (test)";
var mfpServerHostName = 'mobilefoundation-tsuedbro-xv-server.mybluemix.net';//'YOUR MFP Server sampe (mobilefoundation-server.mybluemix.net)';
var mfpServerHostHTTPPort = 80; //'YOUR PORT sample (80)';
var mfpGetPushTokenPath = '/mfp/api/az/v1/token'; // This is the Tokenpath which will not be changed,
                                                  // for more details take a look in the offical documentation
var mfpGetPushTokenScopeCommand = '+messages.write'; // This command will mostlikly not be changed,
                                                     // for more details take a look in the offical documentation
var mfpGetPushTokenScopeApp = "push.application.";//'YOUR DEFINITION FOR THE SCOPE sample (push.application.)';
var mfpGetPushTokenScopeData = "grant_type=client_credentials&scope="; // This command will mostlikly not be changed,
                                                                       // for more details take a look in the offical documentation

var mfpSendPushPath = '/imfpush/v1/apps/';// This command will mostlikly not be changed,
                                          // for more details take a look in the offical documentation
var mfpSendPushPathType = '/messages'; // This command will mostlikly not be changed,
                                       // for more details take a look in the offical documentation

//******************************************************************************
// Own Modules to load
var PushMFP = require('./own_modules/push');
var pushMFP = new PushMFP (mfpGetPushTokenScopeData,
                           mfpGetPushTokenPath,
                           mfpGetPushTokenScopeApp,
                           mfpGetPushTokenScopeCommand,
                           mfpSendPushPath,
                           mfpSendPushPathType);


// create a new express server
var app = express();


// serve the files out of ./public as our main files
// all environments
app.use(express.static(__dirname + '/public'));

// http://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));
/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
// app.set('port', process.env.PORT || 3000);
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log(">>> server starting on URL %s, PORT %s " , appEnv.url, appEnv.port);
  console.log(">>> server env %s" , JSON.stringify(appEnv));
});

/*************************************************
    Doing Push
 **************************************************/
app.post('/sendPush', function(req, res){
    console.log('>>> send Push : ' + req);
    console.log('>>> req.body  : ( %s ) ', JSON.stringify(req.body));
    var input   = req.body.message;
    var message = "Hey this is a Push Message form the Node.js Server";
    if ( req.body.message != undefined ){
      message = input;
    }
    var theResult = JSON.stringify(input);

    pushMFP.sendPush( mfpAppName,
                      mfpServerHostName,
                      mfpServerHostHTTPPort,
                      mfpScopeUser,
                      mfpScopePW,
                      message,
                      function(result){
      console.log("--> Sending a Push Message: ", message);
      message = {'result': result};
      theResult = JSON.stringify(message);
      res.end(theResult);
    });
});
