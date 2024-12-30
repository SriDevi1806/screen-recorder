let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont") ;
let caputerBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";

let recordFlag = false;

let recorder; 
let chunks = []; 

let constraints={
    audio:false,
    video:true,
}

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);
    recorder.addEventListener("start",(e)=>{
        chunks=[];
    })
    recorder.addEventListener("dataavailable",(e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        let blob = new Blob(chunks,{ type: "video/mp4"});
        let videoURL = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = videoURL;
        a.download = "stream.mp4";
        a.click();
    })

    recordBtnCont.addEventListener("click",(e)=>{
        if(!recorder) return;
        recordFlag = !recordFlag;
        if(recordFlag){ // start
            recorder.start();
            recordBtn.classList.add("scale-record");
            startTimer();
        }else{//stop
                recorder.stop();
                recordBtn.classList.remove("scale-record");
                stopTimer();
        }
    })
});


captureBtnCont.addEventListener("click",(e)=>{
    captureBtnCont.classList.add("scale-capture");// adding animations

    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let imageURL = canvas.toDataURL("image/jpeg");

    let tool = canvas.getContext("2d");
    tool.drawImage(video,0,0,canvas.width,canvas.height);
    //Filtering
    tool.fillStyle = transparentColor;
    tool.fillRect(0,0,canvas.width,canvas.height);


    let a = document.createElement('a');
    a.href = imageURL;
    a.download = "Image.jpeg";
    a.click();

    //remove animations
    setTimeout(()=>{
        captureBtn.classList.remove("scale-capture");
    },500);
})

//filtering logic
let filter = document.querySelector(".filter-layer");

let allFilter = document.querySelectorAll(".filter");
allFilter.forEach((filterElem)=>{
    filterElem.addEventListener("click",(e)=>{
        //get style
        transparentColor=getComputedStyle(filterElem).getPropertyValue("background-color");
        filter.style.backgroundColor = transparentColor;
    })
});
