# Using "MobileFirstFoundation Push REST API Version 8" on a Node JS Server

It is nice and easy to send simple push notifications in MobileFirst Foundation 8.0 (from the MobileFirst Operations Console or via REST API), but how do you send push notifications which provide more complex data such as when temperature is low, when you're driving too fast and so on.

To that end, I've implemented a mobile application that integrates several Bluemix services related to IoT, Watson services and so on.

Getting the Authorization key with Postman is not flexible enough, so instead I wrote a self-Authorization node.js module. This module enables me to easily create different instances of the module inside one or more Node.js servers.


This project is a sample: _How to integrate MFP Push REST API in a Node.js Server?_
I build a sample Module called ***push*** and you can use it, on you ***own risk***.
The code contains links to information resources, which maybe can be relevant to understand
the implementation.

To get a ***fast start*** in Understanding, just take a look in these Videos I made on YouTube for this sample:

1. Using the _Push Module_ with the NodeJS Application: https://www.youtube.com/watch?v=VbSQpY5hOzU
2. Register App and configure the Push on the MobileFirstFoundationServer on Bluemix: https://youtu.be/mrpHAvKCe2U

---
***THIS SAMPLE DOES NOT INCLUDE A MOBILE APP***, I do expect you have a MobileApp with a working push MobileFirstFoundation configuration.

If you do not have a App, a _very good_ sample to do this, you can find here:
https://github.com/MobileFirst-Platform-Developer-Center/PushNotificationsCordova/tree/release80

_NOTE:_ When you use this sample, please do not forget to add the **push.mobileclient** scope to mandatory scope section.

![Mandatory Scope](https://github.com/thomassuedbroecker/MobileFirstPushV8OnNodeJS/blob/master/Documentation/scope_mobilepush.png)

---
I did the Node.JS APP, because I want to show all the internal ***NodeJS*** dependencies.
For this Sample I used a ***CF Node.js Application with Bluemix*** and as the
***MobileFirstFoundation Server*** I used the _MobileFoundation Service_ on Bluemix.

I have a existing MobileFirst Cordova MobileApp which is registered to this MobileFirstFoundation Server.

To get more details on the Topic on ***MobileFirstFoundation Push*** Topic, please take a
look in the Offical documentation https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/notifications/ or other resources like https://mapie.help/.

The ***node js module*** is called ***push*** and you can find it in ***own_modules/push.js***.

The module needs to know several information as parameters for the creation and several parameters
when the callback function ***sendPush*** is used.

In the ***git project*** is a sample _Node JS server_ implementation:
How to use the  ***push module***?

To use the module you should know, how the MobileFirstFoundation Push Works.
The focus is ***only*** on the ***Push Module***.

---
## Understanding and Overview

This sequence diagram shows the sequence of the **NodeJS Push Module** usage.

The user can insert the message, he want to send as a Push, on the website.
The Node JS Server function `app.post('/sendPush', function(req, res)` calls
the callback function `pushMFP.sendPush( mfpAppName,mfpServerHostName,mfpServerHostHTTPPort,mfpScopeUser,mfpScopePW,message,function(result)` of the **Node JS Push Module**.
Inside the **node js module** the **MobileFirstFoundation REST API** is used.
The First tasks is to get the access token, to do the push to the MobileFirstFoundation Server.
If the a valid token is received, the push will be executed.
The MobileFirstFoundation Server will check the token and scope, then the server send the push to the
registered push provider like Apple.
Apple sends the Push to the MobileApp.

![Sequence for the Push on the Node JS Server](https://github.com/thomassuedbroecker/MobileFirstPushV8OnNodeJS/blob/master/Documentation/pushModuleSequence-2016-09-26_17-05-54.jpg)

This is the sample **Node JS app UI** you can use to test the **Node JS "push module"**.

1. **Insert your message** you want to sendPush
2. **Press the Button** to send the Push Message
3. **Verify the Push** on your MobileApp build with MobileFirstFoundation

![Node JS Application UI](https://github.com/thomassuedbroecker/MobileFirstPushV8OnNodeJS/blob/master/Documentation/UI-NodeJSApp-2016-09-26_17-05-54.jpg)

---
### Setup of the Push Module
The relevant code for setup the **push module** in the **app.js file**
https://github.com/thomassuedbroecker/MobileFirstPushV8OnNodeJS/blob/master/app.js

In the app file you have to configure the following Variables to your needs.
```javascript
        //******************************************************************************
        // Variables for the Module Usage - Push with MobileFirstFoundation service
        var mfpAppName = 'YOUR APPLICATION NAME sample (com.tsuedbro.mytravelblog)';
        var mfpScopeUser = "YOUR SCOPE USER sample (test)";
        var mfpScopePW = "YOUR SCOPE USER PASSWORD  sample (test)";
        var mfpServerHostName = "YOUR MFP Server sample";
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
```

---
### Usage of the Push Module

The `app.post('/sendPush', function(req, res)` shows the usage of the **Push Module**.
This POST server function does verify the input message, which should be send as a Push and the
callback function of the **Push Module** be utilized to send the _Push Message_.

https://github.com/thomassuedbroecker/MobileFirstPushV8OnNodeJS/blob/master/app.js

```javascript
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
```
---
## Run the node.js app on your Bluemix

Here a _small guide_ (not all steps in detail) how to setup the NodeJS Server project on bluemix.
When you deploy the NodeJS Application into your Bluemix area the NodeJS application will automatically be created.

1. Get yourself a Bluemix Account – register at bluemix.net
2. [Install Node.js][] local
3. Download and extract the **MobileFirstPushV8OnNodeJS** here from github
4. cd into the app directory on your machine **./MobileFirstPushV8OnNodeJS/**
5. Do the needed customization of the variables in the **app.js** file, you can find in the section **Setup of the Push Module**.
6. Ensure you deploy into your **My Project Region** here in my sample it is the US: `cf api https://api.ng.bluemix.net`
7. Login to your Bluemix Area: `cf login`
8. Show your existing apps: `cf apps`
9. Just push the app into your Bluemix Instance: `cf push SampleMFPPushIntegration`
10. See the logs of your app: `cf logs SampleMFPPushIntegration`
11. How to setup the Mobile Foundation Service on Bluemix follow the steps here: https://new-console.ng.bluemix.net/docs/services/mobilefoundation/index.html
12. To building a sample mobile app using MobileFirstFoundation Push follow the steps in this sample: https://github.com/MobileFirst-Platform-Developer-Center/PushNotificationsCordova/tree/release80

_NOTE:_ When you use this sample, please do not forget to add the **push.mobileclient** scope to mandatory application scope section.

![Mandatory Scope](https://github.com/thomassuedbroecker/MobileFirstPushV8OnNodeJS/blob/master/Documentation/scope_mobilepush.png)

_NOTE: Know Issues_

1. If you want to check the push configuration on the MobileFirstServer, please take a look in this video:
https://youtu.be/mrpHAvKCe2U In this video I show, how I did a setup of my sample MobileApp.

2. ***IMPORTANT for usage of the sample NodeJS App:*** When you use the sample NodeJS application ***DO NOT USE*** the ***HTTPS*** to call the application website in your browser!

You must use: ***http://samplemfppushintegration.mybluemix.net/*** and not ***HTTPS://*** samplemfppushintegration.mybluemix.net/ .
The reason is I did not implement the security in my **NodeJS - WebApp** to access the resoures of the Node.JS server on Bluemix.

How to do this maybe this could be a good access point to figure out, how to do that: https://developer.ibm.com/answers/questions/17567/cannot-access-resource-from-bluemix.html



[Install Node.js]: https://nodejs.org/en/download/
