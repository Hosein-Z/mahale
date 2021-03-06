const loginActions=require('/home/smartco1/project/MainApp/DataBase/LoginActions');
const profileActions=require('/home/smartco1/project/MainApp/DataBase/ProfileActions');

function allowSendLoginCode(phone,callback) {loginActions.allowSendLoginCode(phone,(result)=>{ return callback(result)})}

function addCodeTime(phone,code,callback) {loginActions.addCodeTime(phone,code,(result)=>{return callback(result)})}

function checkLoginCode(phone,code,callback){ loginActions.checkLoginCode(phone,code,(result)=>{return callback(result)})}

function getInitialLoginData(phone,callback){ loginActions.getInitialLoginData(phone,(result)=>{return callback(result)})}

function getProfileIconName(data,callback){profileActions.getProfileIconName(data,(result)=>{return callback(result)});}

function updateProfileData(data,callback){
profileActions.updateProfileData(data,(result)=>{return callback(result)})
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.allowSendLoginCode = allowSendLoginCode;
module.exports.addCodeTime = addCodeTime;
module.exports.checkLoginCode = checkLoginCode;
module.exports.getInitialLoginData = getInitialLoginData;
module.exports.getProfileIconName = getProfileIconName;
module.exports.updateProfileData = updateProfileData;
