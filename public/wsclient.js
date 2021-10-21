const socket = io({
    autoConnect: false
});

const HOST="https://digidev.ultracombos.net:5000";

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
    
    updateScore(()=>{
        liff.closeWindow();
    });
    

    

    // window.location.href="../index.html";  
}

function updateScore(callback){

    var data={
        "bot_raw_uid": user_profile.userId,     
        "params":{
            "score": {
                "value":score||0
            }
        }
    };
    const url=HOST+'/result';

    fetch(url, {
        body:JSON.stringify(data),
        headers: {
	        'Content-Type': 'application/json',
	    },
        method: 'POST',
        mode:'cors',
        cache:'no-cache'
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

