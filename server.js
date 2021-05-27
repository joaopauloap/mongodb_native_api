var port = process.env.PORT || 5000;

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://joao:qwerty123@cluster0-i7dxf.gcp.mongodb.net/test?retryWrites=true&w=majority";


const app = express();
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
	response.redirect('/login')
});

app.get('/login', function(request, response) {
	if (request.session.loggedin == true) {
		response.redirect('/home')
	} else {
		response.render(__dirname + "/public/login.ejs",{visi:"invisible",alert:""});
	}
	response.end();
});

app.get('/register', function(request, response) {
	response.render(__dirname + "/public/register.ejs",{visi:"invisible",alert:""});
});


app.post('/reg', function(request, response) {

	MongoClient.connect(url, {useUnifiedTopology: true},function(err, db) {

		const name = request.body.name;
		const email = request.body.email;
		const username = request.body.username;
		const password = request.body.password;
		const note = "Write your note here."
		if (err) throw err;
		var dbo = db.db("mydb");
		let myobj = [{ name: name, email: email, username:username, password:password, note:note}];
		dbo.collection("accounts").insertMany(myobj, function(err, res) {
			if (err){
				console.log(err)
				response.redirect('/error')
			}else{
				response.redirect('/login')
			} 
			db.close();
			response.end();
		});
	});


});

app.post('/auth', function(request, response) {

	MongoClient.connect(url,{useUnifiedTopology: true}, function(err, db) {

		if (err) throw err;

		const username = request.body.username;
		const password = request.body.password;


		let myobj={ 
			username: username, 
			password: password
		}

		db.db("mydb").collection("accounts").findOne(myobj,function(err,res){

			if (err){
				console.log(err)
				response.redirect('/error')
			}else if(res == null){
				response.redirect('/login#')
			}else{
				request.session.loggedin = true;
				request.session.username = res.name;
				response.redirect('/home');
			}
			response.end();
		});


	});

	
});

app.post('/update',function(request,response){

	MongoClient.connect(url, {useUnifiedTopology: true},function(err, db) {
		if (err) throw err;
		
		const mynote = request.body.mynote;
			

		db.db("mydb").collection("accounts").updateOne({name: request.session.username},{$set: { note: mynote }}, function(err, res) {
			if (err){
				console.log(err)
				response.redirect('/error');
			}else{
				response.redirect('/home');
				db.close();
			} 

		});
	});

});

app.get('/logout',function(request,response){
	request.session.loggedin = false;
	response.redirect('/login');
});

app.get('/home', function(request, response) {


	if (request.session.loggedin == true) {

	MongoClient.connect(url,{useUnifiedTopology: true}, function(err, db) {

		if (err) throw err;

		let myobj={ 
			name: request.session.username
		}

		db.db("mydb").collection("accounts").findOne(myobj,function(err,res){

			if (err){
				console.log(err)
				response.redirect('/error')
			}else{

				response.render(__dirname + "/public/home.ejs", {user:request.session.username,note:res.note});		
			}
			response.end();
		});


	});


	} else {
		response.render(__dirname + "/public/unauthorized.ejs");
	}
	
});

app.get('/grid', function(request, response){
	if (request.session.loggedin == true) {
		response.redirect('/home')
	} else {
		response.render(__dirname + "/public/grid/terminal.ejs");
	}
});

app.get('/profile', function(request, response){
	response.render(__dirname + "/public/profile.ejs");
});

app.get('*', function(request, response){
	response.render(__dirname + "/public/error404.ejs");
});

console.log(`Server Running on port ${port} !`)
app.listen(port);

