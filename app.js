const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

// non shareable stuff
const MAPI_KEY = process.env.API_KEY
const MLIST_ID = process.env.LIST_ID
const MAPI_SERVER = process.env.API_SERVER

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signUp.html");
})

app.post("/", (req, res) => {


    const data = {
        members: [{
            email_address: req.body.email,
            status: "subscribed",
            merge_fields: {
                FNAME: req.body.nome,
                LNAME: req.body.sobrenome,
            }
        }]
    }

    const url = "https://"+MAPI_SERVER+".api.mailchimp.com/3.0/lists/"+MLIST_ID;
    const options = {
        method: "POST",
        auth: "nopera:"+MAPI_KEY
    }
    const jsonData = JSON.stringify(data);
    const request = https.request(url, options, response => {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/sucess.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.listen(3000, () => {
    console.log("Hello world on PORT 3000");
})
