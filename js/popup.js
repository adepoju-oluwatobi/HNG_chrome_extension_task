//chrome
document.addEventListener("DOMContentLoaded", () => {
  // Get the selectors of the buttons
  const startVideoButton = document.querySelector("button#start_video");
  const stopVideoButton = document.querySelector("button#stop_video");

  // Function to update the button text and recording state
  startVideoButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "request_recording" },
          function (response) {
              if (!chrome.runtime.lastError) {
                  console.log(response);
              } else {
                  console.log('error line 13');
              }
          }
      );
    });
  }); 

  stopVideoButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "stopvideo" },
          function (response) {
              if (!chrome.runtime.lastError) {
                  console.log(response);
              } else {
                  console.log('error line 40');
              }
          }
      );
    });
  });
});
