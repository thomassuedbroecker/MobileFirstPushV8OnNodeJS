# MobileFirstPushV8OnNodeJS

This project is a sample, how to integrate MFP Push REST API in a Node.js Server.
I build a Module you can use on you own risk.

The code contains links to information resources which maybe can be relevant to understand
the implementation.

To show all the dependencies I created a CF Node.js Application on Bluemix and as
MobileFirst Server I use the MobileFoundation Service on Bluemix.

To get more details on the Topic on MobileFirstFoundation Push Topic, please take a
look in the Offical documentation https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/ or other resources like mfp.help.

The module is called ***push*** and you can find in in ***own_modules/push.js***.

The module needs to know several information as parameter for the creation and several parameter
when the callback function ***sendPush*** is used.

In the git project is a sample Node JS server implementation: how to use the module?


## Run the app locally

1. [Install Node.js][]
2. Download and extract the starter code from the Bluemix UI
3. cd into the app directory
4. Run `npm install` to install the app's dependencies
5. Run `npm start` to start the app
6. Access the running app in a browser at http://localhost:6001

[Install Node.js]: https://nodejs.org/en/download/
