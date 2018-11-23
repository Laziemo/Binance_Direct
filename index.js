'use strict';
//-<..>=======================================================================~|

const request = require('request');
const cron = require('node-cron');
const fs = require('fs');
//const socket = require('socket')
//-<..>=======================================================================~|
const zero = parseFloat(0.00000000);
//defining zero since JS sucks at floating point number comparison
let p_highest = zero;
let p_lowest = parseFloat(20000.00000000);
let p_previous = zero;
let df_previous = parseFloat(0.000000000);

let direction_changed = false;
//direction_changed becomes true only at the point of change in direction
//whenever direction_changed we start adding df_current to delta_sum
let delta_sum = zero;
//when delta_sum beats _delta, it is reset to 0 & direction_changed is set to false
const _delta = parseFloat(0.200000000);
//if df_current is beyond _delta range && direction_changed -> ORDER
//consider +- for both directions: refer to *^* in delta comparison

let muh_usdt = parseFloat(5000.00000000);
let muh_btc = parseFloat(1.00000000);

const API_KEY = process.env.BIN_API_KEY;
const API_SECRET = "shh";

const end_point = "https://api.binance.com";

const exchangeInfo = "/api/v1/exchangeInfo";
const time = "/api/v1/time";
const price = "/api/v3/ticker/price";

let options = {
  method: "",
  url: "",
  headers:
  {
   'X-MBX-APIKEY':API_KEY,
   'Content-Type': 'application/json'
  },
  json: true
};

const line_break = "--------------------------------------------------------";
console.log(`---------------<.Binance Data Bot Initialized.>---------------`);
//-<.f(x).====================================================================~|
/*
logic:

nba_bot follows a simple trading strategy that takes action everytime a significant
shift (_delta) in direction takes place.

Consider, we have 1BTC and its price is moving upwards. The bot holds its position
until the price starts moving down by a significant rate(indicator set by _delta).
In our test case _delta = 0.5%

High volatility in crypto markets = prices constantly changing direction in the
short term and we do not want the bot to respond to these small shifts.

Consider, the price begings to drop at a rate of change of greater than _delta,
we sell our position.

Consider, prices continue to fall. The bot holds its position until the price starts
to move up again by > _delta, at which point, we buy.
*/

let track = (ticker)=>{
  try{
    cron.schedule('*/0.5 * * * * *', () => {
      options.method = "GET";
      options.url = `${end_point}${price}?symbol=${ticker}`;
      request(options,(error,response,body)=>{
        if(error){
          throw error;
        }
        //get time and price
        const present = new Date().toString();
        const p_current = body.price;

        console.log(`${present}:\n`);

        //compare to atl and ath
        //in genesis round p_current will be ath and atl
        if(p_current>p_highest){
          console.log('\x1b[32m%s\x1b[0m',"New High!");
          p_highest = p_current;
        }
        if(p_current<p_lowest){
          console.log('\x1b[31m%s\x1b[0m',"New Low!");
          p_lowest = p_current;
        }
        //calculate %change df
        //in genesis round all the following will be zero
        const df_highest = ((p_current-p_highest)/p_highest) * 100;
        const df_lowest = ((p_current-p_lowest)/p_lowest) * 100;

        const df_current = ((p_current-p_previous)/p_previous) * 100;
//---------------------------
//Main conditionals
//---------------------------
  //direction changes
        if(df_current<zero && df_previous>zero || df_current>zero && df_previous<zero){
          direction_changed = true;
          console.log('\x1b[33m%s\x1b[0m',`Direction Changed!`);

          if(df_current >= _delta){
            console.log('\x1b[31m%s\x1b[0m',"Buying.");
            buy(present,p_current);
            delta_sum = parseFloat(0.00000000);
            direction_changed = false; // incase the change in direction
            //leads to a buy or sell, we set this back to false to prevent adding
            //delta_sum in the next round at *&*
            //Consider a case where change in direction here was greater than _delta
            //and the next df_current is the same direction and also greater than
            // _delta: we must ensure that the bot does not buy again.
          }
          if(df_current <= (_delta*(-1))){//*^*
            console.log('\x1b[35m%s\x1b[0m',"Selling.");
            sell(present,p_current);
            delta_sum = zero;
            direction_changed = false;
          }
          else{//if df_current is not larger than threshold _delta
            delta_sum += df_current;
            //df_current is added to delta_sum and continued at *%* (below)
            //for cases where |df_current| is smaller than |_delta|, we must keep adding
            //df_current to delta_sum in successive rounds until delta_sum beats _delta
          }
        }
  //direction stays the same
        if(df_current>zero && df_previous>zero || df_current<zero && df_previous<zero){
          //first case where we have just come from a direction_change
          if(direction_changed){//*&*
            delta_sum += df_current;//*%*
          }
          if(delta_sum>=_delta){
            console.log('\x1b[32m%s\x1b[0m',"Buying.");
            buy(present,p_current);
            delta_sum = zero;
            direction_changed = false;
            //direction_changed is only made false once the delta_sum beats the
            //threshold: _delta
          }
          if(delta_sum<=(_delta*(-1))){//*^*
            console.log('\x1b[31m%s\x1b[0m',"Selling.");
            sell(present,p_current);
            delta_sum = zero;
            direction_changed = false;
          }
        }
        //set previous value for nek round = current values of this round;


        console.log(`Current:${p_current}`);
        console.log(`Previous:${p_previous}`);
        //console.log(`Difference/Highest:${df_highest}%`);
        //console.log(`Difference/Lowest:${df_lowest}%`);
        console.log(`df_Current:${df_current}%`);
        console.log(`df_Previous:${df_previous}%`);
        console.log(`-----------------------<._.>-----------------------`);

        p_previous = p_current;
        if(df_current!==zero){
          df_previous = df_current;
        }

      });
    });
  }
  catch(e){
    console.log(`Error: ${e}`);
  }
}
//===f(x)-=====================================================================|
let buy = (time,price) =>{
  try{

    muh_btc+=(muh_usdt/price);
    muh_usdt=zero;

    let object = {
      "time": time,
      "action":`Bought BTC @ ${price}`,
      "BTC": muh_btc,
    };

    fs.appendFile('nba.log', `${JSON.stringify(object,null,1)}\n${line_break}\n`,
    (err) => {
      if (err) throw err;
    });
  }
  catch(e){
    console.log(`Error: ${e}`);
  }
}
//===f(x)-=====================================================================|
let sell = (time,price) =>{
  try{
    muh_usdt+=(muh_btc*price);
    muh_btc=zero;

    let object = {
      "time": time,
      "action":`Sold BTC @ ${price}`,
      "USDT": muh_usdt
    };

    fs.appendFile('nba.log', `${JSON.stringify(object,null,1)}\n${line_break}\n`,
    (err) => {
      if (err) throw err;
    });
  }
  catch(e){
    console.log(`Error: ${e}`);
  }
}
//===TEST=====-================================================================|
//-<.TRACK.>==================================================================~|
track("BTCUSDT");
//-<..>=======================================================================~|