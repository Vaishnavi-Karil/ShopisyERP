
const mongoose = require("mongoose")
const categorySchema= new mongoose.Schema({
    name : { 
        type : String, 
        required : true,
        unique : true
    }, 
    parentCategory : {
         type : mongoose.Schema.Types.ObjectId,
         ref : 'Category',
         default : null
    }
}); 

/* 
 1. Footware( Parent Category) --> 1) Women Footware (Child ) 2) Men Footware (Child)
*/

module.exports = mongoose.model('Category', categorySchema);