#!/bin/sh
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org nodejs
service mongod status
npm install -g strongloop
npm install forever -g
npm install
slc run

