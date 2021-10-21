const socket = io({
    autoConnect: false
});

// var socket;
var user_profile;
var score;

function initLiff(){

    
    const defaultLiffId = "1656533144-Mee7ap40";
    
    liff.init({ liffId: defaultLiffId })
    .then(() => {
        // start to use LIFF's api
        document.getElementById('_TxtStatus').innerHTML="liff..."+"initialized";  

        if(!liff.isInClient() && !liff.isLoggedIn()){
            liff.login();
        }else{
            initUser();
        }
    })
    .catch((err) => {
       window.alert(err);
       document.getElementById('_TxtStatus').innerHTML="liff ERR..."+err;
    });

    // liff.ready.then(()=>{
    //     initUser();
    // });

  
}
function initUser(){
    
    console.log('init user...');

    const accessToken=liff.getAccessToken();
    console.log(`accessToken= ${accessToken}`);

    liff.getProfile().then(function (profile) {
        
        // const userId = profile.userId;
        // const name = profile.displayName;
        // const pictureUrl = profile.pictureUrl;
        // const statusMessage = profile.statusMessage;
        user_profile=profile;

        document.getElementById('_TxtStatus').innerHTML="liff..."+`get user: ${user_profile.userId}`;

    }).catch(function(err){
        document.getElementById('_TxtStatus').innerHTML="liff ERR..."+err;
    });
}

function endGame(){
    
    updateScoreToBonnie(()=>{
        liff.closeWindow();
    });
    

    

    // window.location.href="../index.html";  
}

function updateScoreToBonnie(callback){

    var data={
        "bot_raw_uid": user_profile.userId,
        "bot_id":"bot-M-BOieOXZ",
        "bot_pid":"507oftxz",
        "bot_channel":"1",
        "params":{
            "score": {
                "value":score||0
            }
        }
    };
    const url="https://api.botbonnie.com/v1/api/user/params";

    fetch(url, {
        body:JSON.stringify(data),
        headers: {
	    'Access-Control-Allow-Origin':'*',
	    'Access-Control-Allow-Credentials':'true',
	    'Access-Control-Allow-Methods':'GET,POST,OPTIONS',
            'Content-Type': 'application/json',
	    'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImFsbCIsImJvdElkIjoiYm90LU0tQk9pZU9YWiIsImlhdCI6MTYzNDE5NzUzMSwiaXNzIjoiYm90Ym9ubmllX2NvbnNvbGUifQ._Z_iSewMVhwuNKKFSQ-WneFgzVFDq1PFn3M00qhdbOY',
        },
        method: 'POST',
	mode:'cors',
	cache:'no-cache',
	credentials:'include'
    }).then(response=>{
        console.log(response.toString());
        callback();
    }).catch(err=>{
	console.log(err);
    });

}



function connect(){    
    socket.connect();        


    socket.on('connect', ()=>{
        document.getElementById('_WsRcvMessage').innerHTML='ws...connect!';
    });
    socket.on('disconnect', ()=>{
        document.getElementById('_WsRcvMessage').innerHTML='ws...disconnect!';
    });

    socket.on('second', function (second) {
        document.getElementById('_WsRcvMessage').innerHTML='ws...'+second.second;
        
        score=second.second;

    });

    // socket = new WebSocket('ws://localhost:5000');

    // socket.addEventListener('error', (m)=>{ 
    //     document.getElementById('_WsRcvMessage').innerHTML="err..."+m.message; 
    // });
    // socket.addEventListener('open', (m)=>{ 
    //     document.getElementById('_WsRcvMessage').innerHTML="websocket connection open";
    // });
    // socket.addEventListener('message', (m)=>{
    //     document.getElementById('_WsRcvMessage').innerHTML='ws...'+second.second;
    // });

}

function disconnect(){
    socket.disconnect();
}

function sendKey(key){

    // if(user_profile==null) initUser();
    var data={id: user_profile.userId, key:key};
    socket.emit('input',JSON.stringify(data));
}

