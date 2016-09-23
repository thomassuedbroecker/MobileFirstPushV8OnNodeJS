/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

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
var mfpGetPushTokenScopeApp = 'push.application.';
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
app.use(express.static(__dirname + '/public'));

/*************************************************
    Doing Push and Connection to the WebSocket in a Node-RED CF Application
 **************************************************/
app.get('/sendAPush', function(req, res){
    console.log('>>> ******************************************************** ');
    console.log('>>>                  sendAPush                               ');
    console.log('>>> ******************************************************** ');
    var message = "Hey this is a Push Message form the Node.js Server";
    var theResult = "";
    mpfpush.sendPush( mfpAppName,
                      mfpServerHostName,
                      mfpServerHostHTTPPort,
                      mfpScopeUser,
                      mfpScopePW,
                      message,
                      function(result){
      console.log("--> Sending a Push Message: ", message);
      theResult = resultJSON.stringify(result);
      res.end(theResult);
    });
});

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
