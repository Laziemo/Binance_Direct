'use strict';
//-<..>=======================================================================~|
let app = require('express')();
const helmet = require('helmet');
const bodyParser = require('body-parser');
let server = require('http').Server(app);
let io = require('socket.io')(server);

const nba = require('./nba');

app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res)=>{
  res.sendFile('/Users/theliz/Documents/ThroughBit/Development/Bots/Binance_Direct/index.html');
});

io.sockets.on('connection', (socket)=>{
    // When the client connects, they are sent a message
    nba.track("BTCUSDT",socket)
    // When a "message" is received (click on the button), it's logged in the console
});
//-<..>=======================================================================~|
server.listen(8989, ()=>{
  console.log('listening on port :8989');
});
//-<..>=======================================================================~|
