const mongoose = require("mongoose"); 

const productSchema = new mongoose.Schema({
     name : {
         type : String, 
         required : true, 
         trim : true
     }, 
     
    price : {
             type : Number, 
             required : true,
             min: 0
        },
    categoryId : {
         type : mongoose.Schema.Types.ObjectId, 
         ref : "Category"
    },
   
    description : {
        type : String, 
        required : true, 
        trim :true
    },
    sellerId : {
         type : mongoose.Schema.Types.ObjectId,
         ref: "Users", 
         required : true 
    }, 

    image : {
        type : Buffer, 
    }
})

module.exports = mongoose.model('Product', productSchema);