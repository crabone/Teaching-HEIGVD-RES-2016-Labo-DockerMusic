/*
 *
 */
var instruments = require('./instruments');
var activeMusicians = new Map();

var Musician = function(uuid, sound, activeSince, lastKeepAlive) {
  this.uuid = uuid;
  this.sound = sound;
  this.activeSince = activeSince;
  this.lastKeepAlive = lastKeepAlive;
}

// UDP Client
var protocol = require('./auditorium-protocol');

var datagram = require('dgram');
var socket = datagram.createSocket('udp4');

socket.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

socket.on('message', function(msg, source) {
	console.log("Data has arrived: " + msg + ". Source port: " + source.port);

  var musician = JSON.parse(msg);

  if (activeMusicians.has(musician.uuid)) {
    activeMusicians.get(musician.uuid).lastKeepAlive = Date.now();
  } else {
    activeMusicians.set(musician.uuid, new Musician(musician.uuid, musician.instrument, Date.now(), Date.now()));
  }
});

// TCP Server
var net = require('net');
var server = net.createServer();
var serial = [];

server.on('connection', sendActivesMusicians);
server.listen(2205);

function sendActivesMusicians(client) {
  var serial = [];
  activeMusicians.forEach(function(activeMusician, index, array) {
    var duration = Date.now() - activeMusician.lastKeepAlive;

    if (duration >= 5000) {
      activeMusicians.delete(index);
    }
    else {
      var m = {
        uuid: activeMusician.uuid,
        instrument: activeMusician.sound,
        activeSince: new Date(activeMusician.activeSince)
      };
      serial.push(m);
    }
  });
  client.end(JSON.stringify(serial));
}
