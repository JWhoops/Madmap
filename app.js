//import packages
const express     = require("express"),
      bodyParser  = require("body-parser"),
      request 	  = require("request")
      
//app configs
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //parser object from body
app.use(express.static("public"))

app.get("/", (req,res)=>{
  res.render("search_page")
})

app.get("/result_list", (req,res)=>{
		request({
		    url: 'http://localhost:8080/USWISCUWMAD',
		    json: true
		}, function (error, response, body) {
		    if (!error && response.statusCode === 200) {
		        res.render("result_list", {sValue: req.query.sValue,buildings:body.foundBuildings})
		    }
		})
})
app.listen("3000",process.env.IP,()=>{
  console.log("start running the server")
})
