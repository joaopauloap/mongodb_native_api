var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var ejs = require('ejs');


var connection = mysql.createConnection({
	host     : 'db4free.net',
	port     : 3306,
	user     : 'joaopaulo',
	password : 'qwerty123',
	database : 'jpdatabase'
});


var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(express.static(__dirname +'/public'));

app.set('view engine', 'ejs');


app.get('/', function(request, response) {
	response.redirect('/terminal');
});

app.get('/login', function(request, response) {
	response.render(__dirname + "/public/login.ejs",{visi:"invisible",alert:""});
});

app.post('/auth', function(request, response) {


	request.session.loggedin = true;
	response.redirect('/terminal');
	
});

app.get('/logout',function(request,response){
	request.session.loggedin = false;
	response.redirect('/terminal');
});

app.get('/terminal', function(request, response) {
	if (request.session.loggedin == true) {
		response.render(__dirname + "/public/home.ejs");
	} else {	
		response.render(__dirname + "/public/unauthorized.ejs");
	}
	response.end();
});

app.get('*', function(req, res){
	res.status(404).send('<h1>ERROR 404</h1>');
});

console.log("Server Running!")
app.listen(3000);