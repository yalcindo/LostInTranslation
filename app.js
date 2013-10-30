
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var BeGlobal = require('node-beglobal');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
var beglobal = new BeGlobal.BeglobalAPI({
  api_token: 'OwS3JrQzSHtHfckSfvEZUA%3D%3D'
});


app.get('/', routes.index);
app.get('/translate',function(req,res){
	
  res.render("translate");
});
app.get('/quiz',function(req,res){
	
  res.render("quiz");
});


app.get("/translatework",function(req,res){
	var info=req.query;

    beglobal.translations.translate(info,
	  function(err, results) {
	          console.log("results",results)
	    res.send(results);
    });
});
app.get("/quizwork",function(req,res){
	var langTrans=req.query.lang;
    var dummyData={word1:"apple",word2:"pear",word3:"orange",word4:"cherry",
    word5:"melon",word6:"banana",word7:"carrot",word8:"fig"};
	res.send(dummyData);
});





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
