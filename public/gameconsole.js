

function inputCode(txt){
    var text=document.getElementById("_InputCode").value;
    document.getElementById("_InputCode").value=text+txt;
}

function addConsole(id, input_func, send_func){
    
    var container=document.getElementById(id);

    var input=document.createElement('input');
    input.id="_InputCode";
    input.type="text";
    input.disabled=true;

    container.append(input);

    var ctrl=document.createElement('div');

    var keys=['A','↑','B','↓','←','→'];
    for(var k in keys){
       
        const kk=keys[k];

        var btn=document.createElement('button');
        
        btn.innerHTML=kk;
        btn.onclick=function(){
            inputCode(kk);
            input_func(kk);
        };

        ctrl.append(btn);        
    }
    container.append(ctrl);

    var btn_send=document.createElement('button');
    btn_send.innerHTML="Send";
    btn_send.onclick=function(){
        var text=document.getElementById('_InputCode').value;
        send_func(text);
    }

    container.append(btn_send);

}
function clearConsole(){
    document.getElementById("_InputCode").value="";
}