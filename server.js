const express = require('express')
const https = require("https");
const path = require('path')

const axios = require('axios')
const app = express()
const cors = require('cors')
app.use(cors());
const instance = axios.create({
    httpsAgent: new https.Agent({  
         rejectUnauthorized: false
         })});
// app.options("/image",cors())

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

axios.interceptors.request.use(request => {
    console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
  })
  
app.post("/image",(req,res)=>{
    instance.post(req.body.body.endpoint, 
                {data:req.body.body.data},
           { headers: {
                "Content-Type": "application/json",
                "Authorization":req.body.body.token
              },
        }).then((response)=>{
            res.json({image:response.data.image})
        }).catch((e)=>{
            console.log("got error",e.message)
        })
    
    })
app.get("/*", function (req, res) {
    res.sendFile("index.html", { root: "./build" }, function (err) {
        if (err) {
            res.status(500).send(err);
          }
        });
      });
      

app.listen(8000, () =>{
    console.log("server running on port 8000")
})