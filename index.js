const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const myLiffId = process.env.MY_LIFF_ID;
const path = require('path');

// line message webhook
const line = require('@line/bot-sdk');
const { isFunction } = require('util');
const config = {
    channelAccessToken: '3leojDtwVk0QMaU5fvkN4LrknnLLW8pe2gYRNX0Wf7MKFJ9vkr6Icw2dtpW+wOsChtbscMCI0OjpldBbKbGK4Ar1uu/ZBzIjSDwRyo9bCWhtTppbgRNa48b01urrKkPDxKLBPcL+aSFwZ8L8SCs1/gdB04t89/1O/w1cDnyilFU=',
    channelSecret: '7b4c45e3139178c9a9b2ec3dfc3a96cf',
};

// create LINE SDK client
const client = new line.Client(config);

// session
const NodeCache = require("node-cache");
const cache = new NodeCache();


// socket io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// websocket
var expressWs = require('express-ws')(app);

// app.post('/callback', line.middleware(config), (req, res) => {
//     Promise
//     .all(req.body.events.map(handleEvent))
//     .then((result) => res.json(result))
//     .catch((err) => {
//         console.error(err);
//         res.status(500).end();
//     });
    
// });

// event handler
function handleEvent(event,req) {

    

    if (event.type !== 'message' || event.message.type !== 'text') {
        // ignore non-text-message event
        return Promise.resolve(null);
    }
    
    var text=event.message.text;

    if(text=="main"){
        sendMainLiff(event.replyToken);
    }

    var id=event.source.userId;
    
   

    if(!cache.has(id)){
        cache.set(id,text);
    }else{
        cache.set(id, cache.get(id)+text);
    }


    // console.log(id+" -> "+cache.get(id));
    // console.log(cache.keys());

    if(cache.get(id).includes('↑↑↓↓←→←→BA')){
        sendMainLiff(event.replyToken);
        delete codeInput[id];
    }
    
}
function sendMainLiff(replyToken){
    // create a echoing text message
    const home_flex = {
        "type": "flex",
        "altText": "this is a flex message",
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "horizontal",
            "contents": [
            {
                "type": "button",
                "style": "primary",
                "action": {
                "type": "uri",
                "label": "主展場",
                "uri": "https://liff.line.me/1656511168-r2WY13kl"
                }
            }
            ]
          }
        }
      }



    // use reply API
    return client.replyMessage(replyToken, home_flex);
}


app.use(express.static(__dirname + '/public'));

app.get('/send-id', function(req, res) {
    res.json({id: myLiffId});
});

// app.get('/code', function(req, res){
//     console.log('get code');
//     res.send('www');
// });


app.get('/game', function(req, res){
    res.sendFile(path.join(__dirname, '/public/game.html'));
});



// socket io
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('message', {'message': 'hello world'});
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    setInterval(function () {
        socket.emit('second', { 'second': new Date().getSeconds() });
    }, 1000);

    socket.on('input',(data)=>{
        console.log(data);
    });
});
// app.use(function (req, res, next) {
//     console.log('middleware');
//     req.testing = 'testing';
//     return next();
// });

// app.ws('/', function(ws, req) {
//     ws.on('message', function(msg) {
//         console.log(msg);
//     });
//     console.log('socket', req.testing);
// });


server.listen(port, () => console.log(`app listening on port ${port}!`));
