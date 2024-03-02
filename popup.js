// --------------- Event Listeners for button clicks ---------------

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("closetabbtn").addEventListener("click", closeCurrentTab);
    document.getElementById("undoclosebtn").addEventListener("click", undoClosedTab);
    document.getElementById("profilebtn").addEventListener("click", showUserProfile);
    document.getElementById("fullbtn").addEventListener("click", toggleFullScreen);
    document.getElementById("tabbtn").addEventListener("click", newTab);
    document.getElementById("windowbtn").addEventListener("click", newWindow);
    document.getElementById("privatebtn").addEventListener("click", newPrivate);
    
    document.getElementById("tabli").addEventListener("click", newTab);
    document.getElementById("windowli").addEventListener("click", newWindow);
    document.getElementById("privateli").addEventListener("click", newPrivate);
    document.getElementById("fullli").addEventListener("click", toggleFullScreen);
    document.getElementById("profileli").addEventListener("click", showUserProfile);
    document.getElementById("undocloseli").addEventListener("click", undoClosedTab);
    document.getElementById("closeli").addEventListener("click", closeCurrentTab);
});


// --------------- button layout functions ---------------
// --------------- For close tab btn

function closeCurrentTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) {
            chrome.tabs.remove(tabs[0].id);
        }
    });}

// --------------- Undo close tab btn

function undoClosedTab() {
    chrome.sessions.getRecentlyClosed({ maxResults: 1 }, function (sessions) {
        if (sessions && sessions.length > 0) {
            var lastSession = sessions[0];
            chrome.sessions.restore(lastSession.tab ? lastSession.tab.sessionId : lastSession.window.sessionId);
        }
    });}

// --------------- User chrome profile btn ---------------

async function showUserProfile() {
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
    }}
    
// --------------- For full screen btn ---------------

let isFullscreen = false;
function toggleFullScreen() {
    chrome.windows.getCurrent().then(windowInfo => {
        chrome.windows.update(windowInfo.id, { state: isFullscreen ? "normal" : "fullscreen" });
        isFullscreen = !isFullscreen;
    });}
    
// --------------- new tab button ---------------

function newTab() {
    chrome.tabs.create({
        url: "https://web.tabliss.io/"
    });
}

// --------------- For window button ---------------

function newWindow() {
    chrome.windows.create({
        url: "https://web.tabliss.io/",
        type: "normal",
        focused: true
    });
}

// --------------- For private window button ---------------

function newPrivate() {
    chrome.windows.create({
        url: "https://web.tabliss.io/",
        incognito: true
    });
}

// --------------- Button Drag ---------------

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

// ------------------ Transform View List Layout ------------------

let isButtonLayout = true;
let isToggling = false;

function toggleLayouts() {
  if (isToggling) return;

  isToggling = true;

  setTimeout(function() {
    const buttonLayout = document.getElementById('buttonLayout');
    const listLayout = document.getElementById('listLayout');


    isButtonLayout = !isButtonLayout;
    if (isButtonLayout) {
      buttonLayout.style.display = 'flex';
      listLayout.style.display = 'none';
    } else {
      buttonLayout.style.display = 'none';
      listLayout.style.display = 'flex';
    }
    isToggling = false;
  }, 70);
}

document.addEventListener('wheel', function(event) {
  const classesToCheck = ['custom-button', 'button-container', 'layout-container', 'list-items'];
  const targetClassList = event.target.classList;
  const hasAnyClass = classesToCheck.some(className => targetClassList.contains(className));
  if (hasAnyClass) {
    toggleLayouts();
  }
});

// ------------------ Text Data ------------------

const listItems = document.querySelectorAll('.list-item');

listItems.forEach(function(listItem) {
  const labelText = listItem.getAttribute('data-text');
  listItem.textContent = labelText;
});
