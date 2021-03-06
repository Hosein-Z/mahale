const sv=require('/home/smartco1/project/MainApp/DataBase/StaticValues');
const tokenManager=require('/home/smartco1/project/MainApp/TokenManager');
const mongo=require('mongodb').MongoClient;
const mongoUrl='mongodb://'+sv.DataBaseUserName+':'+sv.DataBasePassWord+'@localhost:27017/'+sv.DataBaseName;

const collectionName=sv.UserDataCollectionName
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function allowSendLoginCode(phone,callback) {
    mongo.connect(mongoUrl,function (err,client) {
        const db = client.db(sv.DataBaseName);
        try {
            db.collection(collectionName).find({'Phone' : phone}).toArray(function(err, result) {
                if (err) return callback('e');
                else if (result.length===0)return callback('t');
                else if (result.length>0){
                    const nowTime=(Date.now()/1000).toFixed();
                    if ((nowTime-result[0].CodeTime)>20) return callback('t'); else return callback('e');
                }
                else return callback('e');
            });
        }catch (e) {return callback('e');}
    });
}

function addCodeTime(phone,code,callback) {
    mongo.connect(mongoUrl,function (err,client) {
        const db = client.db(sv.DataBaseName);
        try {
            const nowTime=(Date.now()/1000).toFixed();
            db.collection(collectionName).find({'Phone' : phone}).toArray(function(err, result) {
                if (err) return callback('e');
                // . . . . . . . . . . . . . . . . . . . . . . . . . . .
                else if (result.length===0){
                    const object={'Phone' : phone, 'CodeTime': nowTime, 'Code': code, 'IsUserLogin': '0'};
                    db.collection(collectionName).insertOne(object,function (err,res) {
                        if (err)return callback('e');
                        else return callback('t');
                    });
                }
                // . . . . . . . . . . . . . . . . . . . . . . . . . . .
                else if (result.length>0){
                    try {db.collection(collectionName).update({'Phone' : phone}, {$set: {'CodeTime': nowTime, 'Code': code}});
                    return callback('t');
                    }catch (e) {return callback('e');}
                }
                else return callback('e');
            });
        }catch (e) {return callback('e');}
    });
}

function checkLoginCode(phone,code,callback){
    mongo.connect(mongoUrl,function (err,client) {
        if (err) return callback('e');
        else {
            const db = client.db(sv.DataBaseName);
            try {
                const nowTime = (Date.now() / 1000).toFixed();
                db.collection(collectionName).find({'Phone': phone}).toArray(function (err, result) {
                    if (err) return callback('e');
                    else if (result.length === 0) return callback('e');
                    else if (result.length > 0) {
                        if ((nowTime - result[0].CodeTime) > 180) return callback('f');
                        else if (result[0].Code.toString() === code.toString()){
                         //   db.collection(collectionName).update({'Phone' : phone}, {$set: {'IsUserLogin': 't'}});
                            return callback('t');
                        }
                        else return callback('f');
                    } else return callback('e');
                });
            } catch (e) {return callback('e');}
        }
    });
}

function getInitialLoginData(phone,callback){
    mongo.connect(mongoUrl,function (err,client) {
        if (err) return callback('e');
        else {
            const db = client.db(sv.DataBaseName);
            try {
                db.collection(collectionName).find({'Phone': phone}, { projection: { _id: 0,CodeTime: 0,Code: 0,UserId: 0,Phone: 0}}).toArray(function (err, result) {
                    if (err) return callback('e');
                    else if (result.length === 0) return callback('e');
                    else{

                        if(result[0].IsUserLogin==='0'){
                            const userId=tokenManager.createUserId();
                            tokenManager.createUserToken(userId,phone,(result)=>{
                                if(result==='e') return callback('e');
                                else{
                                  //  jsonO['Token']=result;
                                 //   jsonO['IsNew']='t';
                                    db.collection(collectionName).updateOne({'Phone' : phone}, {$set: {'IsUserLogin': '1',
                                UserId:userId,Token:result}});
                                
                                return callback(result[0]);
                                }
                            })
                        }


                        else if(result[0].IsUserLogin==='1'){
                          //  const jsonO = result[0];
                         //   delete jsonO['UserId']
                         //   delete jsonO['Phone']
                                    /*jsonO['Token']=result[0].Token;
                                    jsonO['IsNew']='f';
                                    jsonO['FirstName']=result[0].FirstName;
                                    jsonO['LastName']=result[0].LastName;
                                    jsonO['WorkName']=result[0].WorkName;
                                    jsonO['WorkType']=result[0].WorkType;
                                    jsonO['Job']=result[0].Job;
                                    jsonO['MaritalStatus']=result[0].MaritalStatus;
                                    jsonO['Gender']=result[0].Gender;
                                    jsonO['DateBirth']=result[0].DateBirth;
                                    jsonO['Province']=result[0].Province;
                                    jsonO['City']=result[0].City;
                                    jsonO['Neighbourhood']=result[0].Neighbourhood;
                                    jsonO['State']=result[0].State;*/
                                    result[0]['status']=0;
                                    return callback(result[0]);
                        }
                        else return callback('e');


                    }

                   /* if (err) return callback('e');
                    else if (result.length === 0) return callback('e');
                    else if (result.length > 0) {
                        if ((nowTime - result[0].CodeTime) > 180) return callback('f');
                        else if (result[0].Code.toString() === code.toString()){
                         //   db.collection(collectionName).update({'Phone' : phone}, {$set: {'IsUserLogin': 't'}});
                            return callback('t');
                        }
                        else return callback('f');
                    } else return callback('e');*/
                });
            } catch (e) {return callback('e');}
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.allowSendLoginCode = allowSendLoginCode;
module.exports.addCodeTime = addCodeTime;
module.exports.checkLoginCode = checkLoginCode;
module.exports.getInitialLoginData = getInitialLoginData;
