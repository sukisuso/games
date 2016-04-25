var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/webapp'));
app.get('/', function(req, res){
	
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
	 socket.on('chat message', function(msg){
	    io.emit('chat message', msg);
	  });
});

http.listen(3000, function(){
  console.log('listening on CONQ:3000 app');
});