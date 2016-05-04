/*
*/

var dgram = require('dgram');
var uid = require('uuid');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams
 */
var socket = dgram.createSocket('udp4');

/*
 * Let's define a javascript class for our thermometer. The constructor accepts
 * a location, an initial temperature and the amplitude of temperature variation
 * at every iteration
 */
function Musician(instrument) {

	this.instrument = instrument;
	var uuid = uid.v4();

/*
   * We will simulate temperature changes on a regular basis. That is something that
   * we implement in a class method (via the prototype)
   */
	Musician.prototype.update = function() {
		var sound = {
			uuid: uuid,
			instrument: this.instrument
		};
		var payload = JSON.stringify(sound);

/*
	   * Finally, let's encapsulate the payload in a UDP datagram, which we publish on
	   * the multicast address. All subscribers to this address will receive the message.
	   */
		message = new Buffer(payload);
		socket.send(message, 0, message.length, 9903, "127.0.0.1", function(err, bytes) {
			console.log("Sending payload: " + payload + " via port " + socket.address().port);
		});

	}

	setInterval(this.update.bind(this), 1000);
}

/*
 * Let's get the thermometer properties from the command line attributes
 * Some error handling wouln't hurt here...
 */
var instrument = process.argv[2];

/*
 * Let's create a new thermoter - the regular publication of measures will
 * be initiated within the constructor
 */
var t1 = new Musician(instrument);
