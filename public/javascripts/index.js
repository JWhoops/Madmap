//add listerner for buttons
document.getElementById("printerBtn").addEventListener("click", ()=>{
	window.location.href = "./views/result.html?sValue=Printer";
});

document.getElementById("microwaveBtn").addEventListener("click", ()=>{
	window.location.href = "./views/result.html?sValue=Microwave";
});

document.getElementById("lacationBtn").addEventListener("click", ()=>{
	alert("still developing")
});

document.getElementById("nappingBtn").addEventListener("click", ()=>{
	alert("still developing")
});

document.getElementById("feedbackBtn").addEventListener("click", ()=>{
	alert("still developing")
});

//dynamic scene
(()=>{
	let hour = new Date().getHours(),
		gLbl = document.getElementById("greetingLbl")
    if(hour>=4 && hour<12){
		gLbl.innerHTML = "Good Morning,"
    	document.body.style.backgroundImage = "url('http://files.all-free-download.com//downloadfiles/wallpapers/2560_1600/cold_morning_wallpaper_winter_nature_1268.jpg')";
    }else if(hour>=12 && hour<18){
    	gLbl.innerHTML = "Good Afternoon,"
    	document.body.style.backgroundImage = "url('https://oceanicexplorer.files.wordpress.com/2012/04/dsc_0430.jpg')";
    }else{
    	gLbl.innerHTML = "Good Evening,"
    	document.body.style.backgroundImage = "url('https://cdn.pixabay.com/photo/2016/01/19/17/14/night-sky-1149595_960_720.jpg')";   
    }
    document.body.style.backgroundSize = "cover"
})()
