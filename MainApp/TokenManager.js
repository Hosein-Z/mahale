const jwt = require('jsonwebtoken');
const tokenSecretKey='^ghQVv$8Lku424_=gdE2)';

function createUserId(){
    const nowTime=Date.now().toString();
    const min = Math.ceil(15689);
    const max = Math.floor(97238);
    const code = (Math.floor(Math.random() * (max - min)) + min).toString();
    const userId=nowTime+code
    return userId
}

function createUserToken(id,phone,callback){
    jwt.sign({ id: id}, tokenSecretKey,(err,token)=>{
        if (!err) return callback(token);
        else return callback('e');
    });
}

function decodeToken(token) {
    const decoded = jwt.verify(token, tokenSecretKey);
    return decoded;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.createUserId = createUserId;
module.exports.createUserToken = createUserToken;
module.exports.decodeToken = decodeToken;

