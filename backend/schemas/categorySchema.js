import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    }
})

const categoryModel = mongoose.model('categorie' , categorySchema)

export default categoryModel