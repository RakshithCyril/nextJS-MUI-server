const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser')
const ImageModel = require('./models/imageModels')
const multer = require('multer');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0', {
    dbName: 'Multer',
    useNewUrlParser: true,
    useUnifiedTopology: true 
}, err => err ? console.log(err) : console.log('Connected to database'));

app.use(cors())
const corsOptions = {
    credentials: true,
    origin:["http://localhost:3000","http://192.168.1.2:3000"],
    optionsSuccessStatus: 200
  }

//Storage
  const Storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        cb(null, file.originalname)
    },
})


app.get("/",(req,res)=>{
    res.send('connected')
})

app.post('/upload',(req,res)=>{
    const upload = multer({
        storage:Storage
    }).single('testImage')
    upload(req,res,(err)=>{
        if(err){
            console.log('Error')
        }
        else{
            const newImage = new ImageModel({
                name: req.body.name,
                image:{
                    data:req.file.filename,
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>{
                res.send('success')
            })
            .catch(()=>{
                res.send('Error Image upload')
            })
        }
    })

    
})
app.post('/test',async(req,res)=>{
    const test = await req.body
    console.log(test)
    res.send('success')
})
app.listen('8080',(req,res)=>{
    console.log('listening')
})