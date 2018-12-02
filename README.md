## Binance Direct

### Overview

Binance direct is a market monitor bot that communicates with Binance exchange's api and collects live data
regarding current best ask/bid prices and volumes at these prices.

The end result is to create a customized trading dashboard to monitior prices every second and integrate private
api access to allow either automated trading by given rules OR cutomized parameters for faster manual trade execution and cancellation.

### Usage

          git clone https://github.com/Laziemo/Binance_Direct.git
          cd Binance_Direct
          npm install
          npm install pm2@latest -g
          pm2 start server.js --watch (use pm2 monit on another screen to monitor logs)


**Live monitor hosted at: http://localhost:8989**

### Upgrades

* Methods to start() & stop() cron.schedule:

  Currently, once the cron schedule to start monitoring a market begins, it will not stop until the
  program is restarted or stopped.

  As a result of this issue, changing the market being monitored requires restarting the server and refreshing the webpage.

  If the client attempts to start monitoring a new market, the charts freak out since the old running cron schedule is still
  sending out socket messages to the chart and confusing it with multiple updates.

  *A worthy upgrade would integrate a start() and stop() method to manage these cron schedules.*

* Develop a 3D chart extension feature to show market depth.

#### Support : please email zenchan@protonmail.com for bug reports and/or queries
