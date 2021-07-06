'use strict';
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;


mongoose.connect('mongodb://localhost:27017/cocktaildb',
 { usenewurlparser: true, useunifiedtopology: true });

 const cocktailSchema =new mongoose.Schema({
    strDrink:String,
    strDrinkThumb:String,

 })
 const myCocktailModel = mongoose.model('cocktail',cocktailSchema)
 

app.get("/",test)
app.get("/cocktail",cocktail)
app.post('/addtoToFav',getFav)
app.get('/getFavCocktail',getFavCocktail)
app.delete('/deleteCocktail/:id',deleteCocktail)
app.put('/updateCoctail/:id',updateCoctail)


function test(req,res){
    res.send('Hello')
}
    

function cocktail(req,res){
    const url='https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic'
    axios.get(url).then(result=>{
        const cocktailArr=result.data.drinks.map(object=>{
            return new Cocktail (object);
        })
        console.log(cocktailArr)
        res.send(cocktailArr)
    })
}

function getFav(req,res){
    const{strDrink,strDrinkThumb}=req.body;

    const newCocktail =new myCocktailModel({
        strDrink:strDrink,
        strDrinkThumb:strDrinkThumb,
    })
    newCocktail.save()
}

function getFavCocktail(req,res){
    myCocktailModel.find({},(error,favData)=>{
        res.send(favData)
    })
}

function deleteCocktail(req,res){
    const id=req.params.id;
    myCocktailModel.remove({_id:id},(error,data1)=>{
        myCocktailModel.find({},(error,data)=>{
            res.send(data)
        })
    })
}

function updateCoctail(req,res){
    const {strDrink,strDrinkThumb}=req.body
    const id =req.params.id;
    myCocktailModel.findOne({_id:id},(error,data1)=>{
        data1.strDrink=strDrink
        data1.strDrinkThumb=strDrinkThumb
        data1.save().then(()=>{
            myCocktailModel.find({},(error,data)=>{
                res.send(data)
            })
        })
    })
}



class Cocktail{
    constructor(data){
        this.strDrink=data.strDrink
        this.strDrinkThumb=data.strDrinkThumb


    }
}




app.listen(PORT, () => {
    console.log(`listening on PORT ${PORT}`);
})