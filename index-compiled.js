'use strict';

var express = require('express');
var http = require('http');
var socketIo = require('socket.io');
var UsersService = require('./UsersService');

var app = express();
var server = http.createServer(app);
var io = socketIo(server);
var userService = new UsersService();

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  // klient nasłuchuje na wiadomość wejścia do czatu
  socket.on('join', function (name) {
    // użytkownika, który pojawił się w aplikacji zapisujemy do serwisu trzymającego listę osób w czacie
    userService.addUser({
      id: socket.id,
      name: name
    });
    // aplikacja emituje zdarzenie update, które aktualizuje informację na temat listy użytkowników każdemu nasłuchującemu na wydarzenie 'update'
    io.emit('update', {
      users: userService.getAllUsers()
    });
  });
  socket.on('disconnect', function () {
    userService.removeUser(socket.id);
    socket.broadcast.emit('update', {
      users: userService.getAllUsers()
    });
  });
  socket.on('message', function (message) {
    var _userService$getUserB = userService.getUserById(socket.id),
        name = _userService$getUserB.name;

    socket.broadcast.emit('message', {
      text: message.text,
      from: name
    });
  });
});

server.listen(3000, function () {
  console.log('listening on *:3000');
});
