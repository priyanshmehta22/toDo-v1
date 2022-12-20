const express =  require('express');
const bodyParser = require('body-parser');
// const date = require(__dirname + "/date.js");

const _ = require("lodash");

const app = express();
const mongoose = require('mongoose');
const e = require('express');
app.set("view engine","ejs");
mongoose.set('strictQuery', true);

require('dotenv').config()

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public")); 
mongoose.connect(process.env.MONGO_URI);

const itemsSchema = new mongoose.Schema({
    name: String
});
const listSchema = new mongoose.Schema({
    name: String,
    items : [itemsSchema]
});


const itemsModel = mongoose.model("item",itemsSchema);
const listModel = mongoose.model("list",listSchema);
const sampleitem = new itemsModel({name:'Check this off after adding a task'});


app.get("/",(req,res)=>{  
    itemsModel.find({},(err,data)=>{
        if(data.length==0){
            itemsModel.insertMany(sampleitem,(err)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("inserted elements");
                }
            });
            res.redirect("/");
        }
        else{
            console.log(data);
            res.render("list",{listTitle: "Today", newListItems: data});
        }
    });
});

app.get("/:customListName",(req,res)=>{
    const customListName= _.capitalize(req.params.customListName);   
    console.log(customListName); 

      listModel.findOne({name:customListName},(err,data)=>{
    if(!err){
        if(!data){
            // console.log("doesnt exist");
            const list = new listModel({
                name:customListName,
                items: sampleitem
            });
            list.save();
        }
        else{
            // console.log("exists");
res.render("list",{listTitle:data.name, newListItems:data.items});
        }
    }  
    });
});

app.post("/",(req,res)=>{
    let itemname = req.body.items;
    let listname = req.body.list;
    let todoitem = new itemsModel({
        name: itemname
    });

    if(listname=="Today"){
    todoitem.save();
    res.redirect("/");
}
    else{
        listModel.findOneAndUpdate({name:listname},{$push:{items:todoitem}},(err,data)=>{
            if(!err){
                res.redirect("/"+listname);
            }
    });
}
});

app.post("/deleted", (req,res)=>{
    const checkedId = req.body.deletedItem;
    const listName = req.body.listName;

    if(listName=="Today"){
        itemsModel.deleteOne({_id:checkedId},(err,data)=>{
            if(err){
                console.log(err);
            }
            else{
    console.log("deleted successfully");
    res.redirect("/");
            }
        })
    }
    else{
        listModel.findOneAndUpdate({name:listName}, {$pull:{items:{_id:checkedId}}},(err,data)=>{
            if(!err){
                res.redirect("/"+ listName);
            }
            
        });
    }
});

app.listen(3000, (req,res)=>{
    console.log("server started");
});