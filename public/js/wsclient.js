const socket = io({
    autoConnect: false
});

//const HOST="https://digidev.ultracombos.net:5000";
const HOST="https://ec2-35-76-68-105.ap-northeast-1.compute.amazonaws.com:5000";

// var socket;
var user_profile;
var score;

function checkLogin(){
        
    if(!liff.isInClient() && !liff.isLoggedIn()){
        
        document.getElementById('_TxtStatus').innerHTML="status..."+"Need Loggin...";
        liff.login();    
    }else{
        initUser();
    }
}

async function initUser(){
    
    document.getElementById('_TxtStatus').innerHTML="status..."+"Init User...";

    const accessToken=liff.getAccessToken();
    console.log(`accessToken= ${accessToken}`);

    try{
        
        const profile=await liff.getProfile();        

        user_profile=profile;
        document.getElementById('_TxtStatus').innerHTML="liff..."+`get user: ${user_profile.userId}`;

    }catch(err){
        document.getElementById('_TxtStatus').innerHTML="liff ERR..."+err;
    };
}

async function endGame(){
    
    updateScore().then(()=>{
        liff.sendMessages([{
            'type': 'text',
            'text': "看分數"
        }]).then(function() {
            liff.closeWindow();
        }).catch(function(error) {
            window.alert('Error sending message: ' + error);
        });
    });
}

async function updateScore(){

    var data={
        "bot_raw_uid": user_profile.userId,     
        "params":{
            "score": {
                "value":score||0
            }
        }
    };
    const url=HOST+'/result';

    try{
        var response=await fetch(url, {
            body:JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            mode:'cors',
            cache:'no-cache'
        });

        return response.json();
    }catch(err){
        return err;
    }

    // .then(response=>{
       
    //     return response.json();        

    // }).then(JsonData=>{
    //     console.log(JsonData);
    // }).catch(err=>{
	//     console.log(err);
    // });

}



function connect(){    
    socket.connect();        


    socket.on('connect', ()=>{
        document.getElementById('_BtnConnect').disabled=true;
        document.getElementById('_BtnDisconnect').disabled=false;

        document.getElementById('_WsRcvMessage').innerHTML='ws...connect!';
    });
    socket.on('disconnect', ()=>{

        document.getElementById('_BtnConnect').disabled=false;
        document.getElementById('_BtnDisconnect').disabled=true;

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

