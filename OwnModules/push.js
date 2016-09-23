// http://www.hacksparrow.com/how-to-write-node-js-modules.html
module.exports = function (theMFPGetPushTokenScopeData,
                           theMFPGetPushTokenPath,
                           theMfpGetPushTokenScopeApp,
                           theMfpGetPushTokenScopeCommand,
                           theMfpSendPushPath,
                           theMfpSendPushPathType) {

  var mfpGetPushTokenScopeData = theMFPGetPushTokenScopeData;
  var mfpGetPushTokenPath = theMFPGetPushTokenPath;
  var mfpGetPushTokenScopeApp = theMfpGetPushTokenScopeApp;
  var mfpGetPushTokenScopeCommand = theMfpGetPushTokenScopeCommand;
  var mfpSendPushPath = theMfpSendPushPath;
  var mfpSendPushPathType = theMfpSendPushPathType;
  /*
  //******************************************************************************
  //                 Get Authorization Token from MFP 8 to Send Push
  // getMFPPushToken( appname, host, port, user, password, result, callback)
  //
  // 1-Build base64 buffer
  // 2-Prepare parameters and variables
  // 3-Prepare application/x-www-form-urlencoded parameters
  // 4-Build header
  // 5-the post options
  // 6-prepare the POST call using https or http
  // 7-do the post and write the Data
  */
  this.sendPush = function ( appname, host, port, user, password, notificationMessage, callback){
      console.log('---> getMFPPushToken');
      var theAppname = appname;
      var theResult = false;
      console.log('---> getMFPPushToken -> theAppname: %s', theAppname );

      var http = require('http');
      var theHost = host;
      console.log('---> getMFPPushToken -> theHost: %s', theHost );

      // http://www.ibm.com/support/knowledgecenter/SSHSCD_8.0.0/com.ibm.worklight.dev.doc/dev/c_non_mobile_to_mobile_services.html#non_mobile_mobile_services
      // testClient:testSecret
      // Build base64 buffer
      var buffer_input= user+':'+password;
      var buffer = new Buffer(buffer_input);
      var string = buffer.toString('base64');
      var theAuthorization = 'Basic ' + string;

      // Prepare parameters and variables
      var thePort = port;
      var thePath = mfpGetPushTokenPath;
      var theMethode = 'POST';
      var theScope = mfpGetPushTokenScopeApp + theAppname + mfpGetPushTokenScopeCommand;
      var theJSON = new Object();

      // Prepare application/x-www-form-urlencoded parameters
      var theData = mfpGetPushTokenScopeData+theScope;
      console.log('---> getMFPPushToken -> Data: %s', theData );

      // Build header
      var postheaders = {
        'Authorization' : theAuthorization,
        'Content-Type'  : 'application/x-www-form-urlencoded',
        'Centent-Length': Buffer.byteLength(theData)
      };

     // the post options
     var optionspost = {
       host : theHost,
       port : thePort,
       path : thePath,
       method : theMethode,
       headers : postheaders
     };
     console.log('---> getMFPPushToken -> Options prepared: %s', JSON.stringify(optionspost));

     // prepare the POST call using https or http
     var reqPost = http.request(optionspost, function(res) {
         console.log("---> getMFPPushToken -> statusCode:  %s ", res.statusCode);
         // uncomment it for header details
         console.log("---> getMFPPushToken -> headers: ", res.headers);

         res.on('data', function(d) {
             console.info('---> getMFPPushToken -> POST result:\n');
             theJSON = JSON.parse(d);
             console.log('---> getMFPPushToken - token_type -> %s', theJSON.token_type);
             console.log('---> getMFPPushToken - access_token -> %s', theJSON.access_token);
             theResult = '' + theJSON.token_type + ' ' + theJSON.access_token + '';
             //console.log('---> getMFPPushToken - result -> %s', result);
             process.stdout.write(d);
                 // -----------------------------------------------------
                 // ---------------------POST PUSH-----------------------
                 // prepare the header MFP Push Header
                 // https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/notifications/sending-push-notifications/
                 // MFP Settings
                 // (no http/https !)
                 var thePort = 80;//9080;
                 var theAuthorization = "";

                 // var https = require('https'); is currently not in use
                 var http = require('http');
                 var thePath = mfpSendPushPath + appname + mfpSendPushPathType ;
                 var theMethode = 'POST';

                 // create the JSON object for MFP Push
                 var jsonObject = JSON.stringify({"message" :{"alert" : notificationMessage}});

                 // Build header
                 var postheaders = {
                   'Authorization' : theResult,
                   'Content-Type'  : 'application/json',
                   'Centent-Length': Buffer.byteLength(jsonObject)
                 };

                 // the post options
                 var optionspost = {
                   host : theHost,
                   port : thePort,
                   path : thePath,
                   method : theMethode,
                   headers : postheaders
                 };
                 console.info('---> sendMFPPush --> Options prepared: %s', optionspost.toString());

                 // prepare the POST call using https or http
                 var reqPost = http.request(optionspost, function(res) {
                     console.log("---> sendMFPPush  --> inner ->  statusCode: ", res.statusCode);
                     // uncomment it for header details
                     console.log("---> sendMFPPush  --> inner ->   headers: ", res.headers);

                     res.on('data', function(d) {
                         console.info('---> sendMFPPush  --> inner -> POST result:\n');
                         process.stdout.write(d);
                         console.info('\n\n---> sendMFPPush  --> inner -> POST completed');
                     });
                 });

                 // doing the post with the json Push Data
                 reqPost.write(jsonObject);
                 reqPost.end();
                 theResult = true;
                 reqPost.on('error', function(e) {
                   console.error(e);
                   theResult = false;
                 });
                 console.log("---> sendMFPPush --> inner -> awarding customer");
             // -----------------------------------------------------
             // -----------------------------------------------------
             console.info('\n\n---> sendMFPPush -> POST completed');
         });
     });

     // do the post and request push token
     reqPost.write(theData);
     reqPost.end();
     reqPost.on('error', function(e) {
       console.error(e);
       theResult = false;
       callback(theResult);
     });
     callback(theResult);
  }
}
