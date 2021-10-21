const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
// const myLiffId = process.env.MY_LIFF_ID;
const path = require('path');

// line message webhook
// const line = require('@line/bot-sdk');
// const { isFunction } = require('util');
// const config = {
//     channelAccessToken: '3leojDtwVk0QMaU5fvkN4LrknnLLW8pe2gYRNX0Wf7MKFJ9vkr6Icw2dtpW+wOsChtbscMCI0OjpldBbKbGK4Ar1uu/ZBzIjSDwRyo9bCWhtTppbgRNa48b01urrKkPDxKLBPcL+aSFwZ8L8SCs1/gdB04t89/1O/w1cDnyilFU=',
//     channelSecret: '7b4c45e3139178c9a9b2ec3dfc3a96cf',
// };

// create LINE SDK client
// const client = new line.Client(config);


// ssl
const https=require('https');
const fs=require('fs');

var options={
	key:fs.readFileSync('/etc/letsencrypt/live/digidev.ultracombos.net/privkey.pem'),
	cert:fs.readFileSync('/etc/letsencrypt/live/digidev.ultracombos.net/fullchain.pem'),
};



// botbonnie api secret
var crypto = require('crypto');
// Express error-handling middleware function.
// Read more: http://expressjs.com/en/guide/error-handling.html
function abortOnError(err, req, res, next){  
	if(err){
		console.log(err);    
		res.status(400).send({ error: "Invalid signature." });
	}else{
		next();
	}
}

// Calculate the X-Hub-Signature header value.
function getSignature(buf) {
	var hmac = crypto.createHmac("sha1", process.env.BOTBONNIE_API_SECRET);
	hmac.update(buf, "utf-8");
	return "sha1=" + hmac.digest("hex");
}

// Verify function compatible with body-parser to retrieve the request payload.
// Read more: https://github.com/expressjs/body-parser#verify
function verifyRequest(req, res, buf, encoding){
	var expected = req.headers['x-hub-signature'];
	var calculated = getSignature(buf);
	console.log("X-Hub-Signature:", expected, "Content:", "-" + buf.toString('utf8') + "-");

	if(expected !== calculated){
		throw new Error("Invalid signature.");
	}else{
		console.log("Valid signature!");
	}
}



// socket io
const http = require('http');
//const server = http.createServer(app);
const server=https.createServer(options,app);

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


// parser
var bodyParser=require('body-parser');
var jsonParser=bodyParser.json();


//cors
var cors=require('cors');
app.use(cors());
app.use(bodyParser.json({ verify: verifyRequest }));


app.use(express.static(__dirname + '/public'));
app.use(abortOnError);


// app.get('/send-id', function(req, res) {
//     res.json({id: myLiffId});
// });

// app.get('/code', function(req, res){
//     console.log('get code');
//     res.send('www');
// });

app.get('/', function(req,res){

	res.send('liff home');
});

app.get('/game', function(req, res){
    res.sendFile(path.join(__dirname, '/public/game.html'));
});
app.get('/console',function(req,res){
	res.sendFile(path.join(__dirname, '/public/console.html'));
});

app.post('/score',jsonParser,function(req,res){
	console.log(JSON.stringify(req.body));
	console.log(JSON.stringify(req.query));
	//res.sendFile(path.join(__dirname,'/public/score.html'));
	

	
	var txt=`score = ${req.body.userParams.score.value}`;
	var liff_url='https://liff.line.me/1656533144-Mee7ap40';
	var url=`${liff_url}/score_page?score=${req.body.userParams.score.value}`;
	const score_message={
		"type":"text", "text":txt,
		"buttons":[
			{ "title":"score page", "type":"web_url", "value":url}
		]
	};

	res.json(score_message);
});

app.get('/score_page',function(req,res){
	console.log('get score page!');
	res.sendFile(path.join(__dirname,'/public/score.html'));
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
	socket.broadcast.emit('input',data);
    });
});




// call botbonnie api
function SendParamRequest(){
	var data={
        "bot_raw_uid": "U032e96a427f7ba5fd6b16c9fe138a7dd",
        "bot_id":"bot-M-BOieOXZ",
        "bot_pid":"507oftxz",
        "bot_channel":"1",
        "params":{
            "score": {
                "value":12345
            }
        }
    };

	var options={
		url:'https://api.botbonnie.com/v1/api/user/params',
		method:'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImFsbCIsImJvdElkIjoiYm90LU0tQk9pZU9YWiIsImlhdCI6MTYzNDE5NzUzMSwiaXNzIjoiYm90Ym9ubmllX2NvbnNvbGUifQ._Z_iSewMVhwuNKKFSQ-WneFgzVFDq1PFn3M00qhdbOY',
		},
		data:JSON.stringify(data),
	}
}

app.post('/result',function(req,res){
	sendParamRequest();

});

SendParamRequest();

server.listen(port, () => console.log(`app listening on port ${port}!`));
