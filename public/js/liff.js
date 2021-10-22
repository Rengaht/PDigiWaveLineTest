async function initLiff() {
    const defaultLiffId = "1656533144-Mee7ap40";

    try{
        await liff.init({
            liffId: defaultLiffId
        });

        document.getElementById('_TxtStatus').innerHTML="status..."+"Liff initialized";
        
    }catch(err){        
        window.alert(err);
        document.getElementById('_TxtStatus').innerHTML="ERR..."+err;
    };
};