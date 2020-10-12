var express = require('express');
var app = express();
var port=8000; 

//connecting with server
let server=require('./server');
let middleware=require('./middleware')


//BODYPARSER FOR POSTMAN
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



//CONNECTING MONGODB TO NODE
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='Inventory';
let db
MongoClient.connect(url, (err,client) => {
        if(err) return console.log(err);
        db=client.db(dbName);
        console.log(`Connected Database: ${url}`);
        console.log(`Database : ${dbName}`);
});
 

//GET HOSPITAL DETAILS
app.get('/hospitaldetails',middleware.checkToken,function(req,res) {
        console.log("Hospital Details are being retrived");
        var data=db.collection('hospitals').find().toArray().then(result => res.json(result));
});
//GET VENTILATOR DETAILS
app.get('/ventilatordetails',middleware.checkToken,function(req,res) {
        console.log("Ventilator Details are being retrived");
        var data=db.collection('ventilators').find().toArray().then(result => res.json(result));
});

//GETTING VENTILATOR DETAILS BY STATUS(OCUUPIED,AVAILABLE,IN-MAINTAINANCE)
app.post('/ventilatorbystatus',middleware.checkToken,(req,res)=>{
        var status=req.body.status;
        console.log(status);
        var details=db.collection('ventilators').find({"status": status}).toArray().then(result => res.json(result));
});

//GETTING VENTILATOR DETAILS BY HOSPITAL NAME
app.post('/ventilatorbyhospital',middleware.checkToken,(req,res)=>{
        var name=req.body.name;
        console.log(name);
        var details=db.collection('ventilators').find({'name':new RegExp(name, 'i')}).toArray().then(result => res.json(result));
});

//GETTING HOSPITAL DETAILS BY NAME
app.post('/hospitalbyname',middleware.checkToken,(req,res) =>{
        var name=req.body.name;
        console.log(name);
        var details=db.collection('hospitals').find({'name':new RegExp(name,'i')}).toArray().then(result => res.json(result));
});

//UPDATING VENTILATOR DETAILS
app.put('/updateventilator',middleware.checkToken,(req,res) =>{
        
        var ventid={vid: req.body.vid};
        console.log(ventid);
        var newvalue={$set :{status:req.body.status}};
        db.collection("ventilators").updateOne(ventid,newvalue,function(err,result){
                res.json('1 document updated');
        });

});

//ADDING VENTILATOR
app.post('/addventilator',middleware.checkToken,(req,res) =>{
        var name=req.body.name;
        var hid=req.body.hid;
        var vid=req.body.vid;
        var status=req.body.status;
        var item={name:name, hid:hid, vid:vid, status:status};
        db.collection('ventilators').insertOne(item,function(err,result){
                res.json('Ventilator inserted');
        });

});

//DELETE VENTILATOR by vid
app.delete('/deleteventbyvid',middleware.checkToken,(req,res) =>{
        var ventid=req.body.vid;
        var item={vid:ventid};
        db.collection('ventilators').deleteOne(item,function(err,obj){
                res.json("1 document deleted");
        });
});



app.listen(port,function(){
        console.log("listening..."+ port);
});




