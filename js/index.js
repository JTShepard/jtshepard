let webcam, labelContainer, maxPredictions; // 

// const image = document.getElementById('image'); 
const image = new Image()
let canvas = null // document.getElementById('canvas');
const dropContainer = document.getElementById('webcam-container');
const warning = document.getElementById('warning');
const fileInput = document.getElementById('fileUploader');

const id2class = {0:"masked", 1:"unmasked"};
let model;


async function initCam() {
    
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(600, 600, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();

    image.src = webcam.canvas.toDataURL();

    window.requestAnimationFrame(loop);
    // append elements to the DOM
    canvas = document.getElementById("webcam-container").appendChild(webcam.canvas);

    var style = canvas.style;
    style.marginLeft = "auto";
    style.marginRight = "auto";
    var parentStyle = canvas.parentElement.style;
    parentStyle.textAlign = "center";
    parentStyle.width = "100%";
}

async function loop() {
    webcam.update(); // update the webcam frame

    // await predict();
    await detectImage(); // jts
    
    window.requestAnimationFrame(loop);
}

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
};

function windowResized() {
  let windowW = window.innerWidth;
  if (windowW < 480 && windowW >= 200) {
    dropContainer.style.display = 'block';
  } else if (windowW < 200) {
    dropContainer.style.display = 'none';
  } else {
    dropContainer.style.display = 'block';
  }
}

// ['dragenter', 'dragover'].forEach(eventName => {
//   dropContainer.addEventListener(eventName, e => dropContainer.classList.add('highlight'), false)
// });

// ['dragleave', 'drop'].forEach(eventName => {
//   dropContainer.addEventListener(eventName, e => dropContainer.classList.remove('highlight'), false)
// });

// ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
//   dropContainer.addEventListener(eventName, preventDefaults, false)
// });

// dropContainer.addEventListener('drop', gotImage, false)

function detectImage() {
  detect(image).then((results) => {
    // canvas.width = image.width;
    // canvas.height = image.height;
    ctx = canvas.getContext('2d');
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    for(bboxInfo of results) {
      bbox = bboxInfo[0];
      classID = bboxInfo[1];
      score = bboxInfo[2];

      ctx.beginPath();
      ctx.lineWidth="4";
      if (classID == 0) {
          ctx.strokeStyle="green";
          ctx.fillStyle="green";
      } else {
          ctx.strokeStyle="red";
          ctx.fillStyle="red";
      }
      ctx.rect(bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1]);
      ctx.stroke();
      
      ctx.font="30px Arial";
      
      let content = id2class[classID] + " " + score.toFixed(2);
      ctx.fillText(content, bbox[0], bbox[1] < 20 ? bbox[1] + 30 : bbox[1]-5);
  }
  })
}

// 初始化函数
async function setup() {
  await loadModel();
  await initCam();
}

setup();
