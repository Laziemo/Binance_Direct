'use strict';
//-<..>=======================================================================~|
let app = require('express')();
const helmet = require('helmet');
const bodyParser = require('body-parser');
let server = require('http').Server(app);
let io = require('socket.io')(server);

const home = process.env.HOME;

const nba = require('./nba');

app.use(helmet());
app.use(helmet.noCache());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res)=>{
  res.sendFile(`${home}/Bots/Binance_Direct/public/index_ab.html`);
});

io.sockets.on('connection', (socket)=>{
    console.log("Socket connection established.")
    nba.track_ab("BTCUSDT",socket);
    /*
  
    //nba.track_ab("BTCUSDT",socket).start();
    //let tracker = new nba.track_ab("BTCUSDT",socket);
    socket.on('start_btc', ()=>{
      nba.track_ab("BTCUSDT",io);
      //tracker.start();
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
*/
    // When a "message" is received (click on the button), it's logged in the console
});
//-<..>=======================================================================~|
server.listen(8989, ()=>{
  console.log('listening on port :8989');
});
//-<..>=======================================================================~|
