const databaseSv=require('/home/smartco1/project/MainApp/DataBase/StaticValues');
const mongo=require('mongodb').MongoClient;
const mongoUrl='mongodb://'+databaseSv.DataBaseUserName+':'+databaseSv.DataBasePassWord+'@localhost:27017/'+databaseSv.DataBaseName;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function isUserExist(userId,callback){
    const collectionName = databaseSv.UserDataCollectionName;
    mongo.connect(mongoUrl,function (err,client) {
        if(err) return callback('e');
        const db = client.db(databaseSv.DataBaseName);
        try {
            db.collection(collectionName).find({UserId : userId}).toArray(function(err, result) {
                if (err) return callback('e');
                else if (result.length===0)return callback('f');
                else if (result.length>0)return callback('t');
                else return callback('e');
            });
        }catch (e) {return callback('e');}
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.isUserExist = isUserExist;
