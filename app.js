
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
var GlobalVar={
  language:"spa"
};
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//beglobal api 
var beglobal = new BeGlobal.BeglobalAPI({
  api_token: 'OwS3JrQzSHtHfckSfvEZUA%3D%3D'
});
// dummyData for Random Words
 var dummyData=[["apple","pear","melon","orange","banana","cherry","fig","avocado"],
 ["red","blue","green","yellow","grey","black","white","dark","light"],["street","road","alley","avenue","court","intersection","house","home"]];

app.get('/', routes.index);
//renders application's page
app.get('/translate',function(req,res){	
  res.render("translate");
});
//renders quiz page
app.get('/quiz',function(req,res){	
  res.render("quiz");
});
//use beglobal api,translates word sends back to client
app.get("/translatework",function(req,res){
	  var info=req.query;
    beglobal.translations.translate(info,
	  function(err, results) {       
	    res.send(results);
    });
});
//Dummy data goes to client
app.get("/quizwork",function(req,res){
  //the practiced language
	GlobalVar.language=req.query.lang;
  console.log("lagtranslate:",GlobalVar.language)
	res.send(dummyData);
});
// Dummy data gets translated

app.get("/quizanswer",function(req,res) {
  var info=req.query;
  console.log("info:",info)
  var bgData={
    text:info.mytext,
    from:GlobalVar.language,
    to:info.to
  };

  beglobal.translations.translate(bgData,
  function(err, results) {
    if (err) {
      return console.log(err);
    }

    console.log("results in bg data",results);
    res.send(results);
  });
 
});
app.get("/quizcorrectanswer",function(req,res){
  var info=req.query;
  info.to=GlobalVar.language;
  console.log("quiz correct answer:",info);
  beglobal.translations.translate(info,
  function(err, results) {
    if (err) {
      return console.log(err);
    }

    console.log("resultsin correct answer",results);
    res.send(results);
  });
})
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
