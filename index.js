var net = require('net');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
var user=[];
var HOST = '127.0.0.1';
var PORT = 5050;
io.on('connection', function(socket){
	var BROADCAST= "Mode: Public";
	var USERLIST= "Mode: List";
	var PRIVATE = "Mode: Private";
	var USER= "User: ";
	var client = new net.Socket();
	client.connect(PORT, HOST, function() {

		console.log('CONNECTED TO: ' + HOST + ':' + PORT);
		

	});

	client.on('data', function(data){ 
		//console.log(data.toString());
		var param=data.toString().split("\r\n.\r\n")[0].split("\r\n");
		if(param[0]==BROADCAST){
			var name = param[1].substring(USER.length);
			socket.emit('reply', name + ": " + param[2]);
		}
		else if(param[0]==USERLIST){
			var list=param.slice(1,param.length-1);
			socket.emit('userlist',list);
		}
		else if(param[0]==PRIVATE){
			var pm={};
			pm.name = param[1].substring(USER.length);
			pm.text = param[2];
			console.log("private: " +pm.name);
			socket.emit('private',pm);
		}
		//else if(command
		//console.log('reply: ' + data +data.length);
		//client.destroy();
		
	});
	client.on('close', function() {
		console.log('Client ' +name+ ' connection closed');
	});

	
 socket.on('nick',function(msg){
	name=msg;
	console.log("Nickname: "+name);
	client.write('Mode: Username\r\n'+name+'\r\n.\r\n');
  });
  socket.on('broadcast', function(msg){
		client.write('Mode: Public\r\n'+msg+'\r\n.\r\n');
	//io.emit('reply', name + ": " + msg);
  });
  socket.on('private', function(msg){
	client.write('Mode: Private\r\n'+name+' ' +msg.name + '\r\n'+ msg.text+'\r\n.\r\n');
  });
  socket.on('getlist',function(){
	client.write('Mode: GetList\r\n.\r\n');
  });
  socket.on('disconnect',function(){
		client.destroy();
		console.log(name+' is disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
