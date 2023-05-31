/*
A NodeJS application connected to a MongoDB Database that performs the following: 
- Add a student
- Edit a student
- Delete a student
- List students and particular student details
- List students and streams or students in a particular stream

To run the application:
- open the terminal and point the path to the application folder
- type "npm install" to install dependencies then "npm start" to run application
To test the endpoints open postman or insomnia on the machine
- Use the url: http://localhost:3000
- add the endpoint to be tested for example, to add a student use: http://localhost:3000/addStudent
*/

//Importing Dependencies
const express = require('express')
const mongoose = require('mongoose')
const {Student} = require("./database.model")
const app = express()
app.use(express.json())
//Setting Global Variables
const PORT  = 3000
// Can be changed to a different MongoDB Database
const DB_URL = "mongodb+srv://emmanuel:iambeck@cluster0.uwsugmk.mongodb.net/kilimo_high_school?retryWrites=true&w=majority"
mongoose.Promise = global.Promise

//Function to start the server
const startServer = async ()=>{

    //Connecting to the database
await mongoose.connect(DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database Connected")
},(error)=>{
    console.log("Error: "+error)
})

//Home Page to Port
    app.get("/",(req,res)=>{
        res.send("Hello World")

    })
    

    //Endpoint to add student
    app.post("/addStudent",async(req,res)=>{
        let params = req.body
        // let student_id = params.student_id
        console.log(params.first_name)
if(params.first_name && params.last_name && params.stream && params.student_id)
{
    let student = await Student.findOne({student_id: params.student_id})
if(student == null)
{
    let student = new Student(params)
    //Saving Student to database
    await student.save().then((resp)=>{
        console.log(resp)
        // res.send("Added Student")
        res.send(resp)
    }).catch((error)=>{
        console.log(error)
         res.send(error)
        })
    }else{
        res.send("Student already exist")
    }

}else
{
    res.send({"error":"Parameters required are missing"})
}
        })
       //Endpoint to edit student which takes a parameter student id
    app.post("/editStudent",async(req,res)=>{
        let params = req.body
        let student_id = params.student_id
        console.log(student_id)
        if(student_id)
        {
            console.log("Hey")
            let student = await Student.findOne({student_id: student_id})
       if(student == null){
        res.send("Student not found")
       }else{
        let _id = student._id
        await Student.findOneAndUpdate({_id:_id},params)
        .then((resp)=>{
            res.send(resp)
        }).catch((err)=>{
            res.send(err)
        })
        // res.send(student)
       }
        }else{
            console.log("No Student ID")
            res.send("No student ID Found in Request")
        }
        
    })

    /*
    Endpoint to view all students
    if student id is added as a query it returns detail for one student
    */
    app.get("/students",async (req,res)=>{
        let params = await req.query
        let student_id = params.student_id
        console.log(params)
        if(student_id)
        {
            let student = await Student.findOne({student_id: student_id})
            if(student == null){
                res.send("Student not found")
               }else{
                
                res.send(student)
               }
        }else 
        {
            let students = await Student.find()
        res.send(students)

        }
    })
    /*
    Endpoint to view all streams for class
    if stream is added as a query it returns all students in that stream
    */
    app.get("/streams",async (req,res)=>{
        let params = await req.query
        let stream = params.stream
        console.log(params)
        if(stream)
        {
            let streamClass = await Student.findOne({stream: stream})
            if(streamClass == null){
                res.send("Stream not found")
               }else{
                
                res.send(streamClass)
               }
        }else 
        {
            let streams = await Student.find()
        res.send(streams)

        }
    })

    //Endpoint to delete student which takes student id as the query 
    app.delete("/deleteStudent",async(req,res)=>{
        let params = req.query
        let student_id = params.student_id
        if(student_id)
        {
        await Student.findOneAndDelete({student_id:student_id}).then((resp)=>{
            res.send(resp)
        }).catch((err)=>{
            res.send(err)
        })
    }else{
        res.send("Student ID is a required query")
    }
    })

    //Setting server to listen to port defined
    app.listen(PORT,(req,res)=>{
        console.log("Server running on port: "+PORT)
            })
}
startServer()