console.log("Hi, I have been injected!");

let recorder = null;
let recordedChunks = [];

function generateUniqueVideoId() {
  // Generate a timestamp-based unique ID
  const timestamp = Date.now();

  // Generate a random number (between 1 and 10000) to add some randomness
  const random = Math.floor(Math.random() * 10000) + 1;

  // Combine the timestamp and random number to create the ID
  return `${timestamp}-${random}`;
}

function onAccessApproved(stream) {
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  recorder.onstop = function () {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const videoId = generateUniqueVideoId();
    const fileName = `screen-recording-${videoId}.webm`;
    const formData = new FormData();
    formData.append("video", blob, fileName);
  
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const base64Data = fileReader.result;
      console.log(base64Data);
  
      // const apiUrl = "https://stage5-4qe0.onrender.com/upload"
      const apiUrl = "http://localhost:3000/upload";
      
      fetch(apiUrl, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
          }
          return response.json();
        })
        .then((data) => {
          console.log("Video uploaded successfully:", data);
          console.log(formData)
  
          const newPageUrl = 'http://localhost:3001/home/';
          window.open(newPageUrl, "_blank");
        })
        .catch((error) => {
          console.error("Error uploading video:", error);
        });
    };
  
    fileReader.readAsDataURL(blob);
  
    recordedChunks = [];
  };

  recorder.start();
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "request_recording") {
    console.log("requesting recording");

    sendResponse(`processed: ${message.action}`);

    navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: {
          width: 1280,
          height: 720,
        },
      })
      .then((stream) => {
        onAccessApproved(stream);
      });
  }

  if (message.action === "stopvideo") {
    console.log("stopping video");
    sendResponse(`processed: ${message.action}`);
    if (!recorder) return console.log("no recorder");

    recorder.stop();
  }
});
