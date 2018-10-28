//import packages
const express     = require("express"),
      bodyParser  = require("body-parser")
      
//app configs
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true})) //parser object from body


app.get("/", (req,res)=>{
  res.render("search_page")
})

app.get("/result_list", (req,res)=>{
	res.render("result_list",{sValue: req.query.sValue })
})

app.listen("8080",process.env.IP,()=>{
  console.log("start running the server")
})
