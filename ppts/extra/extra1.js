var express = require('express');
var app = express();
var port=process.env.PORT || 8000; 


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
app.get('/hospitaldetails',function(req,res) {
        console.log("Hospital Details are being retrived");
        var data=db.collection('hospitals').find().toArray().then(result => res.json(result));
});
//GET VENTILATOR DETAILS
app.get('/ventilatordetails',function(req,res) {
        console.log("Ventilator Details are being retrived");
        var data=db.collection('ventilators').find().toArray().then(result => res.json(result));
});

//GETTING VENTILATOR DETAILS BY STATUS(OCUUPIED,AVAILABLE,IN-MAINTAINANCE)
app.get('/ventilatorbystatus',(req,res)=>{
        var status=req.body.status;
        console.log(status);
        var details=db.collection('ventilators').find({"status": status}).toArray().then(result => res.json(result));
});

//GETTING VENTILATOR DETAILS BY HOSPITAL NAME
app.get('/ventilatorbyhospital',(req,res)=>{
        var name=req.query.name;
        console.log(name);
        var details=db.collection('ventilators').find({'name':new RegExp(name, 'i')}).toArray().then(result => res.json(result));
});

app.listen(port,function(){
        console.log("listening..."+ port);
});