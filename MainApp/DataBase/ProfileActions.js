const multer=require('multer');
const mongo=require('mongodb').MongoClient;
const sv=require('/home/smartco1/project/MainApp/DataBase/StaticValues');
const mongoUrl='mongodb://'+sv.DataBaseUserName+':'+sv.DataBasePassWord+'@localhost:27017/'+sv.DataBaseName;

const publicActions=require('/home/smartco1/project/MainApp/PublicActions');
const tokenManager=require('/home/smartco1/project/MainApp/TokenManager');

const collectionName=sv.UserDataCollectionName
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function getProfileIconName(data,callback){
    try{
        const json=JSON.parse(data);
    const userId = tokenManager.decodeToken(json.token).id
    publicActions.isUserExist(userId,(result)=>{
        if(result==='t') return callback(userId)
        else return callback('e')
});
    }catch(e){return callback('e')}
}

function updateProfileData(data,callback){
    try{
    const json=data;
    const userId = tokenManager.decodeToken(json.token).id
    publicActions.isUserExist(userId,(result)=>{
        if(result==='t'){
            
            mongo.connect(mongoUrl,function (err,client) {
                const db = client.db(sv.DataBaseName);
                try{
                    try {
                        delete json['token']
                        delete json['Token']
                        delete json['UserId']
                        delete json['Phone']
                        db.collection(collectionName).updateOne({'UserId' : userId}, {$set: 
                            json
                        });
                    return callback('t');
                    }catch (e) {return callback(e.toString());}
                }catch(e){return callback('e')}
            });
            
        }else return callback(result)
    });
    
    }catch(e){return callback('e')}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports.getProfileIconName = getProfileIconName;
module.exports.updateProfileData = updateProfileData;
