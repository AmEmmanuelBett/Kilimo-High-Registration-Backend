/*
Schema for the model is defined here and imported into the index.js file for actions
*/

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const classSchema = new Schema({
    stream:{
        type: String,
    },
    first_name:{
        type: String
    },last_name:{
        type: String
    },student_id:{
        type: String,
    }
})

const Student = mongoose.model('student',classSchema);
module.exports = {
    Student
}