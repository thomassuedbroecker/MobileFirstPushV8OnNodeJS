#!/bin/bash
# Information steps:
# 1) chmod u+x push-and-log.sh
# 2) ./push-and-log.sh
# cf api https://api.eu-gb.bluemix.net UK
# cf api https://api.ng.bluemix.net US

echo "--> Ensure to deploy into the My Project Region"
cd ..
cf api https://api.ng.bluemix.net
cf login

echo "--> Starting push and log CF SampleMFPPushIntegration"

echo "****** show existing apps *********"
cf apps
echo "******* push to CF ********"
cf push SampleMFPPushIntegration
echo "******* start CF logging ********"
cf logs SampleMFPPushIntegration
