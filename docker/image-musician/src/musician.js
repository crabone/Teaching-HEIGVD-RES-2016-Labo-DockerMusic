/*
*/

var protocol = require('./auditorium-protocol');

var dgram = require('dgram');
var uid = require('uuid');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams
 */
var socket = dgram.createSocket('udp4');

function Musician(instrument) {

	this.instrument = instrument;
	var uuid = uid.v4();

	Musician.prototype.update = function() {
		var sound = {
			uuid: uuid,
			instrument: this.instrument
		};
		var payload = JSON.stringify(sound);

		message = new Buffer(payload);
		socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + socket.address().port);
		});
	}

	setInterval(this.update.bind(this), 1000);
}

var instrument = process.argv[2];

var m1 = new Musician(instrument);
