var socket = io();

socket.on('connect', function () {
  console.log('I AM CONNECTED VIA A WEBSOCKET!!');
});

socket.on('message', function (message) {
  $('.messages').append(JSON.stringify(message) + '<br>');
});

var $messageInput = $('#special-message');

$('#send-message').on('click', function () {
  socket.send('message', {
    username: 'markus',
    text: $messageInput.val()
  });
});
