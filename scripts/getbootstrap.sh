#! /bin/bash

wget http://twitter.github.com/bootstrap/assets/bootstrap.zip
unzip bootstrap.zip

cp bootstrap/css/bootstrap.min.css ../static/css/bootstrap.min.css 
cp bootstrap/css/bootstrap.css ../static/css/bootstrap.css 
cp bootstrap/js/bootstrap.min.js ../static/js/bootstrap.min.js 
cp bootstrap/js/bootstrap.js ../static/js/bootstrap.js 

rm -rf bootstrap*