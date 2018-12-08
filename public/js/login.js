// Основные параметры
var ip = window.location.hostname;
var port = '443';

// Действуем после загрузки html

$(document).ready(function() {
    // Сокет
    var ws;
    
    let
        setContactStatus,
        setOrderStatus;
    
    // Функция подключения
    var connect = function() {
        ws = new WebSocket('ws://'+ip+':'+port);
        ws.onopen = onopen;
		ws.onmessage = onmessage;
		ws.onerror = onerror;
		ws.onclose = onclose;
    }
    
    // При подключении к серверу
    function onopen() {
        // Если нет уникальной строки клиента, то получить ее от сервера
        if (localStorage.getItem('sh') == null) {
			ws.send(JSON.stringify({
				type: 'connect',
				data: {
					sh: ''
				}
			}));
		} else {
			ws.send(JSON.stringify({
				type: 'connect',
				data: {
					sh: localStorage.getItem('sh')
				}
			}));
		}
    }
    
    // При получении сообщений от сервера
    function onmessage(evt) {
        try {
            var m = JSON.parse(evt.data);
        } catch (e) {
            return;
        }
        
        // Анализ полученных данных
        switch (m['type']) {
                
            // Устанавливаем уникальную строку
            case 'setSH':
                localStorage.setItem('sh', m['data'].sh);
            break;
                
            // Статус обратной связи
            case 'reg_ok':
                reg_ok(m['data']);
            break;
                
            // Статус заказа
            case 'setOrderStatus':
                setOrderStatus(m['data']);
            break;
                
            // Дефолтная обработка
            default:
                console.log('Неизвестный запрос: '+m['type']);
            break;
        }
    }
    
    
    // Устанавливаем коннект
    connect();
    
    // Регистрация
    $('body').on('click', '#submit-btn', () => {
        let
            credetials = {};
        
        credetials.login = $('.reg-login').val();
        credetials.password = $('.reg-pass').val();
        
        sendMsg('registration', credetials);
        
    });
    
    // Ок регистрация
    var reg_ok = (data) => {
        alert(data);
    }
    
    // Функция отправки
	var sendMsg = function(type, data) {
		ws.send(JSON.stringify({
			type: type,
			data: data,
            sh: localStorage.getItem('sh')
		}));
	}
    
});

