/*jslint node: true */
'use strict';

// Подключение express
var express = require('express');
//var WebSocketServer = new require('ws');
var requestParser = require("body-parser");
var md5 = require("./md5");
var hbs = require("hbs");
var nodemailer = require("nodemailer");
var mongoose = require('mongoose');

//Custom modules:
let dbConnection = require('custom_modules/connection.ts');
let emailSender = require('custom_modules/email_mngr.js');

// Создаем объект приложения
var app = express();
var host = getIPAddress();
var hostdb = "localhost";
var port = "27017";
var appport = 80;
var wsport = 443;

// Устанавливаем нахождение представлений
hbs.registerPartials(__dirname + '/views/particales');

app.use(express.static(__dirname + '/public'));
app.use(requestParser.urlencoded({extended : true}));
app.set('view engine', 'hbs');

// Главная страница
app.get('/', (req, res) => {	
	// Отсылаем главную
	res.render('signInUp.hbs');
});

app.get('/panel', (req, res) => {
	res.render('index.hbs');
});

app.post('/login', (req, res) => {
	console.log(req.body);
	dbConnection.findUser(req.body.login);
});

//login=${loginData}&name=${nameData}&secondName=${secondNameData}&group=${groupNumberData}&email=${emailData}&phone=${phoneData}&pass=${passData}&passRepeat=${passRepeatData}
//let EmailModel = require('custom_modules/user.ts');
app.post('/register', (req, res) => {
	console.log(req.body);
	//dbConnection.Kitten
	//var silence = new Kitten({ name: 'Silence' });

	/*let test = new EmailModel({email: 'ada.lovelace@gmail.com'});
	
	console.log(test.email);
	
	test.save(function (err, test) {
		if (err) return console.error(err);
		console.log(test);
	});*/

	let AccessTypeModel = require('custom_modules/access_type_model.ts');
	let UserModel = require('custom_modules/user_model.ts');

	AccessTypeModel.find({}, function(err, foundAccessTypes) {
		if (foundAccessTypes.length == 0){
			let adminType = new AccessTypeModel({_id: mongoose.Types.ObjectId(), accessType: 'Admin'});
			adminType.save(function(err, adminType){
				if (err) return console.error(err);
			});
			let teacherType = new AccessTypeModel({_id: mongoose.Types.ObjectId(), accessType: 'Teacher'});
			teacherType.save(function(err, teacherType){
				if (err) return console.error(err);
			});
			let userType = new AccessTypeModel({_id: mongoose.Types.ObjectId(), accessType: 'User'});
			userType.save(function(err, userType){
				if (err) return console.error(err);
			});
		}
		UserModel.find({login: req.body.login}, function(err, foundUsers){
			if (foundUsers.length == 0){
				AccessTypeModel.findOne({accessType: 'User'}, function (err, userType) {
					let PassModel = require('custom_modules/password_model.ts');
					let newPass = new PassModel({_id: mongoose.Types.ObjectId(), pass: req.body.pass});
					newPass.save(function(err, newPass){
						if (err) return console.error(err);
							
						let newUser = new UserModel({
							_id: mongoose.Types.ObjectId(),
							login: req.body.login,
							name: req.body.name,
							secondName: req.body.secondName,
							group: req.body.group,
							email: req.body.email,
							phone: req.body.phone,
							accessType: userType._id,
							pass: newPass._id
						});
						newUser.save(function(err, newUser){
							console.log("successful register")
						});
					});
				});
			} else {
				console.log("already registered user with login: " + req.body.login);
				
			}
		});
	});
	

	






	//register
	/*dbConnection.findUser(req.body.login, (res) => {
		console.log(res);
		if (res == null || res.length == 0){
			dbConnection.addUser(req.body.login, req.body.pass, req.body.name, req.body.secondName, req.body.group, req.body.email, req.body.phone);
		} else if (res.length > 0){
			//Login already registered
			//console.log(res[0].name)
			//console.log(res[0].password)
			console.log("Login already registered");
		}
	});*/
});

app.listen(appport, () => {
	console.log('==========[ Сервер запущен ]==========');
	console.log('IP:' + host);
});

//определение IP
function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }

  return 'localhost';
}

// использование Math.round() даст неравномерное распределение!
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}



function isValidEmail(m) { 
    return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(m);
}
    
function isValidName(m) { 
    return m.length > 1;
}
    
function isValidText(m) { 
    return m.length > 10;
}