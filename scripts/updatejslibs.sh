#! /bin/bash

wget http://twitter.github.com/bootstrap/assets/bootstrap.zip
unzip bootstrap.zip

cp bootstrap/css/bootstrap.min.css ../static/css/bootstrap.min.css 
cp bootstrap/css/bootstrap.css ../static/css/bootstrap.css 
cp bootstrap/js/bootstrap.min.js ../static/js/bootstrap.min.js 
cp bootstrap/js/bootstrap.js ../static/js/bootstrap.js 
cp bootstrap/img/glyphicons-halflings-white.png ../static/img/glyphicons-halflings-white.png 
cp bootstrap/img/glyphicons-halflings.png ../static/img/glyphicons-halflings.png 

#rm -rf bootstrap*

wget http://d3js.org/d3.v2.min.js
mv d3.v2.min.js ../static/js/d3.v2.min.js

wget http://backbonejs.org/backbone-min.js
mv backbone-min.js ../static/js/backbone-min.js

wget http://underscorejs.org/underscore-min.js
mv underscore-min.js ../static/js/underscore.js

wget https://github.com/jeromegn/Backbone.localStorage/blob/master/backbone.localStorage-min.js
mv backbone.localStorage-min.js ../static/js/backbone.localStorage-min.js

wget https://github.com/jeromegn/Backbone.localStorage/blob/master/backbone.localStorage.js
mv backbone.localStorage.js ../static/js/backbone.localStorage.js
