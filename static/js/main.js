/* =====================================================
   Chicken Disease Classification AI
===================================================== */

let base_data = "";

const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileinput");

const browseBtn = document.getElementById("uload");
const predictBtn = document.getElementById("send");

const previewImage = document.getElementById("photo");
const resultImage = document.getElementById("resultImage");

const previewVideo = document.getElementById("video");

const loading = document.getElementById("loading");

const predictionResult = document.getElementById("predictionResult");
const diseaseName = document.getElementById("diseaseName");
const statusText = document.getElementById("statusText");
const jsonOutput = document.getElementById("jsonOutput");

const statusIcon = document.getElementById("statusIcon");

const apiURL = document.getElementById("url").value;


/* =====================================================
   Browse Button
===================================================== */

browseBtn.onclick = () => fileInput.click();


/* =====================================================
   Drag Drop
===================================================== */

uploadBox.addEventListener("dragover",(e)=>{

    e.preventDefault();

    uploadBox.classList.add("drag-over");

});

uploadBox.addEventListener("dragleave",()=>{

    uploadBox.classList.remove("drag-over");

});

uploadBox.addEventListener("drop",(e)=>{

    e.preventDefault();

    uploadBox.classList.remove("drag-over");

    if(e.dataTransfer.files.length){

        fileInput.files = e.dataTransfer.files;

        loadImage(e.dataTransfer.files[0]);

    }

});


/* =====================================================
   File Input
===================================================== */

fileInput.addEventListener("change", () => {

    console.log("CHANGE EVENT FIRED");

    console.log(fileInput.files);

    if (fileInput.files.length) {

        console.log(fileInput.files[0]);

        loadImage(fileInput.files[0]);

    }

});


/* =====================================================
   Load Image
===================================================== */

function loadImage(file){

    const reader = new FileReader();

    reader.onload = function(e){

        previewImage.src = e.target.result;

        resultImage.src = e.target.result;

        previewImage.style.display = "block";

        resultImage.style.display = "block";

        previewVideo.style.display = "none";

        const img = new Image();

        img.onload = function(){

            const canvas = document.createElement("canvas");

            canvas.width = img.width;

            canvas.height = img.height;

            const ctx = canvas.getContext("2d");

            ctx.drawImage(img,0,0);

            base_data = canvas.toDataURL(
                "image/jpeg",
                1.0
            ).replace(/^data:image.+;base64,/,"");

        };

        img.src = e.target.result;

    };

    reader.readAsDataURL(file);

}


/* =====================================================
   Predict
===================================================== */

predictBtn.addEventListener("click",()=>{

    if(base_data===""){

        alert("Please upload an image.");

        return;

    }

    sendRequest();

});


/* =====================================================
   AJAX
===================================================== */

function sendRequest(){

    loading.style.display="flex";

    $.ajax({

        url:apiURL,

        type:"POST",

        data:JSON.stringify({

            image:base_data

        }),

        contentType:"application/json",

        success:function(res){

            loading.style.display="none";

            updateUI(res);

        },

        error:function(){

            loading.style.display="none";

            alert("Prediction failed.");

        }

    });

}


/* =====================================================
   Update UI
===================================================== */

function updateUI(res){

    jsonOutput.textContent =
        JSON.stringify(res,null,2);

    let prediction="Unknown";

    try{

        prediction=res[0].image;

    }

    catch{

        prediction="Prediction Completed";

    }

    predictionResult.innerHTML=prediction;

    diseaseName.innerHTML=prediction;

    statusText.innerHTML="Completed";


    if(prediction.toLowerCase().includes("healthy")){

        statusIcon.classList.remove("bg-danger");

        statusIcon.classList.add("bg-success");

        statusIcon.innerHTML='<i class="fa-solid fa-circle-check"></i>';

    }

    else{

        statusIcon.classList.remove("bg-success");

        statusIcon.classList.add("bg-danger");

        statusIcon.innerHTML='<i class="fa-solid fa-triangle-exclamation"></i>';

    }

}