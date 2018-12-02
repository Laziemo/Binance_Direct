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
  res.sendFile('/Users/theliz/Documents/ThroughBit/Development/Bots/Binance_Direct/index_ab.html');
});

io.sockets.on('connection', (socket)=>{
    console.log("Socket connection established.")
    //nba.track_ab("BTCUSDT",socket);
    let tracker;
    socket.on('start_btc', ()=>{
      nba.track_ab("BTCUSDT",io);
      console.log("Tracking BTC/USDT...");
    });
    socket.on('start_ada', ()=>{
      nba.track_ab("ADAUSDT",io);
      console.log("Tracking DGB/USDT...");
    });
    socket.on('start_etc', ()=>{
      nba.track_ab("ETCUSDT",io);
      console.log("Tracking ETC/USDT...");
    });

    // When a "message" is received (click on the button), it's logged in the console
});
//-<..>=======================================================================~|
server.listen(8989, ()=>{
  console.log('listening on port :8989');
});
//-<..>=======================================================================~|
