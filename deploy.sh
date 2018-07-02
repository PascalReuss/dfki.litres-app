#!/bin/bash
# cd /var/www/dfki-cbr
sudo systemctl stop dfki-cbr
git pull origin master
npm install
sudo systemctl start dfki-cbr