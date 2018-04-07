/**
 * FILE:	CLI.js
 *
 * USAGE:	node CLI.js
 *
 * DESCRIPTION:	Monitor CLI from Arduino.
 * Send SMS/PushOver message when certain messages are received.
 * Serve a webpage containing Arduino messages.
 *
 * AUTHOR: 	Mark Wrigley
 * CREATED:     13.03.2018
 * REVISIONS:   
 *              
 * CONFIG:	
 * RPI connected via USB to Arduino.
 *
 * Adapted from GPIO code.
 * Added SerialPort, so as to read strings from the Arduino.
 *
 * create subdir 'public' and store the following files there:
 *   index.html
 *   ...?
 *
 */
 


//--REQUIRES-------------------------------------------------------------------

const io = require('socket.io');
const connect = require('connect');
const serveStatic =require('serve-static');
const fs = require('fs');
const Gpio = require('onoff').Gpio;
const SerialPort = require('serialport');

//--CONST----------------------------------------------------------------------

const Port = 2002;
const app = connect().use(serveStatic('public')).listen(Port);
const controlPanel = io.listen(app);   

//--SERIAL PORT----------------------------------------------------------------

/**
 * TO DO: auto detect which port the Arduino is using, or
 * set up some config to bind Arduino to one port only. Sometimes
 * the Arduino comes up on ACM0, sometimes on ACM1.
 *
 * https://github.com/node-serialport/node-serialport/blob/5.0.0/README.md
 */
 
const ReadLine = SerialPort.parsers.Readline;
const portName = '/dev/ttyACM0';
//const parser = new ReadLine({delimiter: '\r\n'});
const parser = new ReadLine();
const ArduinoPort = new SerialPort(portName, {
  baudRate: 9600,
  databits:8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
});
ArduinoPort.pipe(parser);



// when data received from Arduino on the serial port, send it to web clients
parser.on('data', function (data) {
  controlPanel.sockets.emit('serialEvent', '@['+timeStamp()+']: '+data);
  // debugging:
  x++;
  console.log('Arduino: (',x,') ',timeStamp()+' '+data);
});

//--VAR------------------------------------------------------------------------

/**
 * NOTE:
 * declare vars here, but initialise them in the bootSequence code.
 */
var x;


//-----------------------------------------------------------------------------

/**
 * scheduler is a function that can be assigned to variable later on
 * it accepts two parameters: timeout and a call back function
 * and returns a function that invokes the call back function after a timeout
 *
 * use it to schedule some action in the future without having to block
 * other code from executing while waiting
 *
 
   EXAMPLE: send a 500mS pulse to a GPIO pin
 
   var schedule0 = scheduler(500, function doStuff() {
     GPIOpin.writeSync(0)
   });
   GPIOpin.writeSync(1)    // sets pin
   schedule0();            // will clear pin after 500ms
   <...other code...>      // this code can execute without being blocked

 *
 */

var scheduler = function(timeout, callbackfunction) {
  return function() {
    setTimeout(callbackfunction, timeout)
  }
};

//--FUNCTIONS------------------------------------------------------------------

function bootSequence() {
 /**
  * All actions to be taken at start up are gathered here.
  * This makes it easier to maintain the startup code and makes
  * it easier to control the GPIO assignment and release
  * (in the following exit() code)
  *
  */
  
x=0;

}

//-----------------------------------------------------------------------------

function exit() {

 /**
  * All code that needs to run before the program exits is here.
  * The most important code is the release of the GPIOs.
  */

  // no GPIOs configured
 
  process.exit();
}

//-----------------------------------------------------------------------------

function timeStamp() {
  var d = new Date();
  var tsH = d.getHours();
  var tsM = d.getMinutes();
  var tsS = d.getSeconds();
  if (tsH < 10) {
    tsH = '0'+tsH;
  }
  if (tsM < 10) {
    tsM = '0'+tsM;
  }
  if (tsS < 10) {
    tsS = '0'+tsS;
  }
  var ts = tsH+':'+tsM+':'+tsS;
  return ts;
}

//-----------------------------------------------------------------------------

/**
 *  controlPanel object handles signals from socket
 */

controlPanel.on('connection', function (socket) {
   /**
    * this stuff runs when a new browser connection is made
    */
    var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;
    var clientPort = socket.request.connection.remotePort;
    socket.emit('ipaddr',clientIp);
    socket.emit('ipport',clientPort);
    
});


//---START HERE----------------------------------------------------------------

bootSequence();

//---END HERE -----------------------------------------------------------------

process.on('SIGINT',exit);

//---END OF CODE---------------------------------------------------------------

