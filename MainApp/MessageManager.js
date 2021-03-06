const databaseManager = require('/home/smartco1/project/MainApp/DataBase/Manager');
const mainToken = require('/home/smartco1/project/MainApp/TokenManager');
const Kavenegar = require('kavenegar');
const api = Kavenegar.KavenegarApi({
    apikey: '363548555133505547764B55354946306971756A79736C5A5876614258524735'
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function sendLoginMessage(phone,callback) {
      databaseManager.allowSendLoginCode(phone,(result)=>{
          if (result==='t'){
              sendMessage(phone,(result)=>{
              return callback(result)
          });
          }
          else return callback(result)
    })
}

function sendMessage(phone,callback){
    const min = Math.ceil(15689);
    const max = Math.floor(97238);
    const code = Math.floor(Math.random() * (max - min)) + min;

    databaseManager.addCodeTime(phone,code,(result)=>{
         if (result==='t'){


            api.VerifyLookup({
                receptor: phone,
                token: code,
                 template: "AvaGhanon97"
                }, function(response, status) {
                    if(response[0].status===5)return callback('t')
                    else return callback('e')
                     });

  /*  client.manualSendCode(phone, "کد تایید هویت شما " + code)
        .then((messageId) => {
            return callback('t')
        })
        .catch(error => {return callback('e')});*/


    }else return callback(result)
});
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.sendLoginMessage = sendLoginMessage;

