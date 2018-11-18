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
    //morning
    if(hour>=4 && hour<12){
		gLbl.innerHTML = "Good Morning,"
    	document.body.style.backgroundImage = "url('./public/resources/morning.jpg')";
    //afternoon
    }else if(hour>=12 && hour<18){
    	gLbl.innerHTML = "Good Afternoon,"
    	document.body.style.backgroundImage = "url('./public/resources/afternoon.jpg')";
    //evening
    }else{
    	gLbl.innerHTML = "Good Evening,"
    	document.body.style.backgroundImage = "url('./public/resources/evening.jpg')";   
    }
    document.body.style.backgroundSize = "cover"//stretch the background image
})()
