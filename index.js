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
	var USER= "User: ";
	var client = new net.Socket();
	client.connect(PORT, HOST, function() {

		console.log('CONNECTED TO: ' + HOST + ':' + PORT);
		

	});

	client.on('data', function(data){ 
		console.log(data.toString());
		var param=data.toString().split("\r\n.\r\n")[0].split("\r\n");
		if(param[0]==BROADCAST){
			var name = param[1].substring(USER.length);
			socket.emit('reply', name + ": " + param[2]);
		}
		if(param[0]==USERLIST){
			var list=param.slice(1,param.length-1);
			socket.emit('userlist',list);
		}
		//else if(command
		console.log('reply: ' + data +data.length);
		//client.destroy();
		
	});
	client.on('close', function() {
		console.log('Connection closed');
	});

	
 socket.on('nick',function(msg){
	name=msg;
	console.log(name);
	client.write('Mode: Username\r\n'+name+'\r\n.\r\n');
  });
  socket.on('broadcast', function(msg){
		client.write('Mode: Public\r\n'+msg+'\r\n.\r\n');
	//io.emit('reply', name + ": " + msg);
  });
  socket.on('private', function(msg){
	
  });
  socket.on('getlist',function(){
	client.write('Mode: GetList\r\n.\r\n');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
