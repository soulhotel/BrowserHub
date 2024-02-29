// new tab button
document.getElementById("tabbtn").addEventListener("click", function () {
  chrome.tabs.create({
    url: "https://web.tabliss.io/"
  });
});

// For window button
document.getElementById("windowbtn").addEventListener("click", function () {
  chrome.windows.create({
    url: "https://web.tabliss.io/",
    type: "normal",
    focused: true
  });
});

// For private window button
document.getElementById("privatebtn").addEventListener("click", function () {
  chrome.windows.create({
    url: "https://web.tabliss.io/",
    incognito: true
  });
});

// For full screen button
let isFullscreen = false;

document.getElementById("fullbtn").addEventListener("click", function () {
  chrome.windows.getCurrent().then(windowInfo => {
    chrome.windows.update(windowInfo.id, { state: isFullscreen ? "normal" : "fullscreen" });
    isFullscreen = !isFullscreen;
  });
});

// For close tab button
function closeCurrentTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.remove(tabs[0].id);
    }
  });
}

document.getElementById("closetabbtn").addEventListener("click", closeCurrentTab);


// User chrome profile button
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("profilebtn").addEventListener("click", async function () {
        if (typeof browser !== 'undefined' && browser.downloads) {
            try {
                await browser.downloads.showDefaultFolder();
                console.log("Showing default folder.");
            } catch (error) {
                console.error("Error showing default folder:", error);
            }
        } else if (typeof chrome !== 'undefined' && chrome.downloads) {
            try {
                await chrome.tabs.create({ url: "about:support" });
                console.log("Opening Firefox's profile folder.");
            } catch (error) {
                console.error("Error opening Firefox's profile folder:", error);
            }
        } else {
            console.error("Downloads API is not supported in this browser.");
        }
    });
});

//devtools btn nvm

// undo close tab btn

document.addEventListener('DOMContentLoaded', function() {
    var undoClosedTabBtn = document.getElementById('undoclosebtn');

    undoClosedTabBtn.addEventListener('click', function() {
        chrome.sessions.getRecentlyClosed({ maxResults: 1 }, function(sessions) {
            if (sessions && sessions.length > 0) {
                var lastSession = sessions[0];
                chrome.sessions.restore(lastSession.tab ? lastSession.tab.sessionId : lastSession.window.sessionId);
            }
        });
    });
});


// well that was a wild ride. i mean not really, but im new to this :)