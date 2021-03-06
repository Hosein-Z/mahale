const express=require('express');
const port=process.env.PORT;
const app=express();
const multer=require('multer');



const databaseManager = require('/home/smartco1/project/MainApp/DataBase/Manager');
const messageManager = require('/home/smartco1/project/MainApp/MessageManager');
const tokenManager=require('/home/smartco1/project/MainApp/TokenManager');


// / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / /
app.get('/',(req,res)=>{
    res.send('Hiii')
});
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.get('/SendLoginCode',(req,res)=>{
    
    const phone=req.headers['phone'];
     
   if (phone.length > 12 || phone.length < 10) res.send('{"status":2}');
   else{
        messageManager.sendLoginMessage(phone, (result) => {
            if(result==='t') res.send('{"status":0}');
            else res.send('{"status":1}');
        })
    }
});


app.get('/LoginProfile',(req,res)=>{
    try {
        const data = JSON.parse(req.headers['data']);
        const phone = data.phone;
        const code = data.code;
            databaseManager.checkLoginCode(phone, code, (result) => {
                if (result === 't') {
                    databaseManager.getInitialLoginData(phone, (result) => {
                        if (result === 'e') res.send('{"status":1}')
                        else res.send(result)
                    })
                }
                 else if (result === 'f') res.send('{"status":2}')
                 else res.send('{"status":1}')
            })
    }
    catch (e){res.send('{"status":1}')}
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const storage=multer.diskStorage({
    destination:'/home/smartco1/profile/images',
    filename:(req,file,cb)=>{
        databaseManager.getProfileIconName(req.headers['data'],(result)=>{
            if(result!=='e')return cb(null,result)
        })
        
       // return cb(null,`${2}${path.extname(file.originalname)}`)
    }
})


const upload=multer({
    storage:storage
})

app.post('/UpdateProfileImage',upload.single('image'),function(req,res){
    try{
        if(req.file.size>1) res.send('{"status":0}')
        else res.send('{"status":1}')
    }catch(e){res.send('{"status":1}')}
})

app.get('/DownloadProfileImage',(req,res)=>{
    const data=JSON.parse(req.headers['data']);
    const userId=tokenManager.decodeToken(data.token).id

    const filePath = `/home/smartco1/profile/images/${userId}`;
    const fileName = "icon.png";
    res.download(filePath, fileName);
});

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/UpdateProfileData',(req,res)=>{
    const data=JSON.parse(req.body.data);
    data['token']=req.headers['token'];
databaseManager.updateProfileData(data,(result)=>{
    if (result === 't') res.send('{"status":0}')
    else res.send('{"status":1}')
})
})

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.listen(port);
