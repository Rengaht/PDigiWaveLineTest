const socket = io({
    autoConnect: false
});
var user_profile;


function initLiff(){

    
    const defaultLiffId = "1656511168-418w0aPd";
    
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

        document.getElementById('_TxtStatus').innerHTML="liff ERR..."+`get user: ${user_profile.userId}`;

    }).catch(function(err){
        document.getElementById('_TxtStatus').innerHTML="liff ERR..."+err;
    });
}

function endGame(){
    liff.closeWindow();
    // window.location.href="../index.html";  
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
    });
}

function disconnect(){
    socket.disconnect();
}

function sendKey(key){

    // if(user_profile==null) initUser();

    socket.emit('input',{id: user_profile.userId, key:key});
}

