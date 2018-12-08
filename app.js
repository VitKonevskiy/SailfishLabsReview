/*jslint node: true */
'use strict';

// Подключение express
var express = require('express');
var WebSocketServer = new require('ws');
var bodyParser = require("body-parser");
var md5 = require("./md5");
var hbs = require("hbs");
var nodemailer = require("nodemailer");


// Создаем объект приложения
var app = express();
var jsonParser = bodyParser.json();
var host = getIPAddress();
var hostdb = "localhost";
var port = "27017";
//var bd = "tokyo52";
var appport = 80;
var wsport = 443;


// Устанавливаем нахождение представлений
hbs.registerPartials(__dirname + '/views/particales');

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'hbs');

// Главная страница
app.get('/', (req, res) => {	
	// Отсылаем главную
	res.render('index.hbs');
});

// Свадьбы
app.get('/wedding', (req, res) => {	
	// Отсылаем главную
	res.render('wedding.hbs');
});

// Ивенты
app.get('/event', (req, res) => {	
	// Отсылаем главную
	res.render('event.hbs');
});

// Дет. сады и школы
app.get('/school', (req, res) => {	
	// Отсылаем главную
	res.render('school.hbs');
});

// Онлайн трансялции
app.get('/online', (req, res) => {	
	// Отсылаем главную
	res.render('online.hbs');
});

app.listen(appport, () => {
	console.log('==========[ Сервер запущен ]==========');
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

// WebSocket-сервер на порту 443
var webSocketServer = new WebSocketServer.Server({
	port: wsport
});

//массив клиентов, проходящих тест
var peers = [[]];

webSocketServer.on('connection', function (ws) {
    
    let
        feedback,
        appSend;
    
		//ws.send(JSON.stringify({'type':'map', 'data':map}));
		//получаем данные
	ws.on('message', function (message) {
		try {
			var m = JSON.parse(message);
		} catch (e) {
			return;
		}
		
		switch (m['type']) {
			//получаем номер сессии и получаем доступ к ней
			case 'echo':
				echos(m['data']); //отвечаем
			break;
				
			//коннектимся к серверу
			case 'connect':
				var maxIndex = peers.length;
				peers[maxIndex] = [];
				if (m['data'].sh == '') {
					var nowData = new Date();
					nowData /= 1000;
					peers[maxIndex][0] = md5(md5('133videosalon.info331')+md5(nowData.toString()));
				} else {
					peers[maxIndex][0] = m['data'].sh;
				}
				peers[maxIndex][1] = ws;
				//отправляем sh
				peers[maxIndex][1].send(JSON.stringify({
					type: 'setSH',
					data: {
						sh: peers[maxIndex][0]
					}
				}))
				console.log('Пришел '+peers[maxIndex][0]);
				console.log('Теперь клиентов '+(peers.length-1));
			break;
            
            case 'registration':
                registration(m['data'], m['sh']);                
            break;

			default:
				console.log('==[!]== Error: Неизвестный запрос.');
            break;
		}
	});
	
	//закрываем соединение
	ws.on('close', function () {
		for (var i=0; i<peers.length; i++) {
			if (peers[i][1] == ws) {
				console.log('Ушел '+peers[i][0]);
				if (peers[i][3] != undefined) {
					stopTest({sh: peers[i][0], answers: {nameTest: peers[i][3]}});
				}
				peers[i][3] = undefined;
				clearInterval(peers[i][2]); //удаляем таймер
				peers[i][2] = undefined;
				peers.splice(i, 1);
			}
		}
	});
    
    var registration = (data, sh) => {
        console.log(data);
        console.log(sh);
        
        sendToClient(sh, 'reg_ok', 'Регистрация завершена');
    }
    
    // Отсылка обратно клиенту
	var sendToClient = function(sh, type, data) {
		data = data || {};
		for (var i=0; i<peers.length; i++) {
			if (peers[i][0] == sh) {
				peers[i][1].send(JSON.stringify({
					type: type,
					data: data
				}));
			}
		}
	}
});

function isValidEmail(m) { 
    return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(m);
}
    
function isValidName(m) { 
    return m.length > 1;
}
    
function isValidText(m) { 
    return m.length > 10;
}