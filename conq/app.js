var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/webapp'));
app.disable('x-powered-by');
app.get('/', function(req, res){
	
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
	
	console.log('userconected');
	
	 socket.on('game message', function(msg){
	    io.emit('game message', msg);
	  });
	 
	 socket.on('disconnect', function () {
	 });
});




http.listen(3000, function(){
  console.log('listening on CONQ:3000 app');
});




//gestion de partidas 
/*
 var allClients = [];
io.sockets.on('connection', function(socket) {
   allClients.push(socket);

   socket.on('disconnect', function() {
      console.log('Got disconnect!');

      var i = allClients.indexOf(socket);
      allClients.splice(i, 1);
   });
});
 */