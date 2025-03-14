#!/bin/bash

cd flask && docker build -t raissaglaucie34/my_flask_image . && cd ..
cd nginx/reactApp && docker build -t raissaglaucie34/my_react_image . && cd..
echo 'log is here' ; ls ; pwd

echo "$DOCKER_PASSWORD" | docker login -u raissaglaucie34 --password-stdin

docker push raissaglaucie34/my_flask_image && docker push raissaglaucie34/my_react_image