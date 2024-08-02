// --------------- Event Listeners for button clicks ---------------

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("closetabbtn").addEventListener("click", closeCurrentTab);
    document.getElementById("undoclosebtn").addEventListener("click", undoClosedTab);
    document.getElementById("fullbtn").addEventListener("click", toggleFullScreen);
    document.getElementById("tabbtn").addEventListener("click", newTab);
    document.getElementById("windowbtn").addEventListener("click", newWindow);
    document.getElementById("privatebtn").addEventListener("click", newPrivate);
    document.getElementById("saveURLbtn").addEventListener("click", saveURLButtonClickHandler);
    document.getElementById("tabwalkerbtn").addEventListener("click", openTabWalker);
    document.getElementById("lightdarkbtn").addEventListener("click", toggleLight);

    document.getElementById("tabli").addEventListener("click", newTab);
    document.getElementById("windowli").addEventListener("click", newWindow);
    document.getElementById("privateli").addEventListener("click", newPrivate);
    document.getElementById("fullli").addEventListener("click", toggleFullScreen);
    document.getElementById("undocloseli").addEventListener("click", undoClosedTab);
    document.getElementById("closeli").addEventListener("click", closeCurrentTab);
    document.getElementById("saveURLli").addEventListener("click", saveURLButtonClickHandler);
    document.getElementById("tabwalkerli").addEventListener("click", openTabWalker);
    document.getElementById("lightdarkli").addEventListener("click", toggleLight);
});

// ------------------ Variables ------------------
let statustabwalker = 'closed';

// ------------------ Layout selection ------------------
// ------------------------ first storage check

function applyStoredLayoutPreference(savedLayoutPreference) {
  const buttonLayout = document.getElementById('buttonLayout');
  const listLayout = document.getElementById('listLayout');
  if (savedLayoutPreference === 'list') {
    buttonLayout.style.display = 'none';
    listLayout.style.display = 'flex';
  } else {
    buttonLayout.style.display = 'flex';
    listLayout.style.display = 'none';
  }
}

// Function to retrieve and notify about the stored layout preference
function notifyStoredLayoutPreference() {
  browser.storage.local.get('layoutPreference').then(result => {
    const savedLayoutPreference = result.layoutPreference;
    if (savedLayoutPreference) {
      console.log('The layout currently stored is:', savedLayoutPreference);
      // Apply the stored layout preference
      applyStoredLayoutPreference(savedLayoutPreference);
    } else {
      console.log('No layout preference stored yet.');
      // Apply default layout
      applyStoredLayoutPreference('button');
    }
  }).catch(error => {
    console.error('Error retrieving layout preference:', error);
  });
}

document.addEventListener('popupClosed', notifyStoredLayoutPreference);
document.addEventListener('DOMContentLoaded', notifyStoredLayoutPreference);

// ------------------ Open Correct Layout ------------------

document.addEventListener('DOMContentLoaded', retrieveStoredLayoutPreference);

function retrieveStoredLayoutPreference() {
  browser.storage.local.get('layoutPreference')
    .then(result => {
      const savedLayoutPreference = result.layoutPreference;
      console.log('Retrieved layout preference from browser storage:', savedLayoutPreference);
      isButtonLayout = savedLayoutPreference === 'button';
      applyLayout(); // Apply the retrieved layout preference
    })
    .catch(error => {
      console.error('Error retrieving layout preference:', error);
      // Handle the error gracefully, such as setting a default layout
      // For example, fallback to the button layout:
      isButtonLayout = true;
      applyLayout();
    });
}
// ------------------ Default is Button Layout

let isButtonLayout = true;
let isToggling = false;

function applyLayout() {
  const buttonLayout = document.getElementById('buttonLayout');
  const listLayout = document.getElementById('listLayout');

  if (isButtonLayout) {
    buttonLayout.style.display = 'flex';
    listLayout.style.display = 'none';
  } else {
    buttonLayout.style.display = 'none';
    listLayout.style.display = 'flex';
    if (statustabwalker === 'opened') {
      overlay.style.display = 'none';
      statustabwalker = 'closed';
      window.location.reload();
    }
  }
}

function toggleLayout() {
  if (isToggling) return;

  isToggling = true;

  isButtonLayout = !isButtonLayout;

  // Apply the layout
  applyLayout();

  // Save the layout state for when the popup is closed
  browser.storage.local.set({ 'layoutPreference': isButtonLayout ? 'button' : 'list' })
    .then(() => {
      console.log('Layout preference saved to browser storage:', isButtonLayout ? 'button' : 'list');
    })
    .catch(error => {
      console.error('Error saving layout preference:', error);
    });

  isToggling = false;
}

// --------------- scroll on the Hub to toggle a layout switch ---------------
// --------------- toggle layout will switch layout, and save the state ---------------

document.getElementById('listLayout').addEventListener('wheel', function(event) {
  toggleLayout();
});

document.getElementById('buttonLayout').addEventListener('wheel', function(event) {
  toggleLayout();
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

// --------------- For full screen btn ---------------

let isFullscreen = false;
function toggleFullScreen() {
    chrome.windows.getCurrent().then(windowInfo => {
        chrome.windows.update(windowInfo.id, { state: isFullscreen ? "normal" : "fullscreen" });
        isFullscreen = !isFullscreen;
    });}
    
// --------------- new tab button ---------------

async function newTab() {
    try {
        const savedURL = await browser.storage.local.get('savedURL');
        if (!savedURL.savedURL) {
            await browser.tabs.create({});
        } else {
            await browser.tabs.create({ url: savedURL.savedURL });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// --------------- For window button ---------------

async function newWindow() {
    try {
        const savedURL = await browser.storage.local.get('savedURL');
        if (!savedURL.savedURL) {
            chrome.windows.create({
              type: "normal",
              focused: true
            });
        } else {
            chrome.windows.create({
              url: savedURL,
              type: "normal",
              focused: true
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}









// --------------- For private window button ---------------

function newPrivate() {
    chrome.windows.create({
        url: "https://web.tabliss.io/",
        incognito: true
    });
}

// ------------------ Text Data ------------------

const listItems = document.querySelectorAll('.list-item');

listItems.forEach(function(listItem) {
  const labelText = listItem.getAttribute('data-text');
  listItem.textContent = labelText;
});



// ------------------- For saveurl button -------------------------------

// Define the event listener function
function saveURLButtonClickHandler() {
  try {
    // Check if Tab Walker is open
    if (statustabwalker === 'opened') {
      overlay.style.display = 'none';
      statustabwalker = 'closed';
    }

    // Adjust body styles to display dialog container
    document.body.style.height = '150px';
    document.body.style.width = '255px'; 
    document.body.style.overflow = 'hidden'; // Hide vertical scrollbar
    const listItems = document.querySelectorAll('.list-item');
    listItems.forEach(item => {
      item.style.opacity = '0';
    });

    // Display the dialog container
    const dialog = document.getElementById('dialog-container');
    dialog.style.display = 'flex';

    // Get the URL input element
    const URLPathInput = document.getElementById('URLPathInput');

    // Add event listener to the select URL button
    document.getElementById('selectURLButton').addEventListener('click', function() {
      const url = URLPathInput.value;
      console.log('User entered URL:', url);

      // Save the URL in extension storage
      if (url) {
        browser.storage.local.set({ 'savedURL': url }).then(() => {
          console.log('URL saved:', url);
        }).catch(error => {
          console.error('Error saving URL:', error);
        });
      } else {
        console.log('No URL entered. Dialog closed.');
      }

      // Hide the dialog container
      dialog.style.display = 'none';

      // Reset body styles
      document.body.style.height = ''; // Reset to default
      document.body.style.width = ''; // Reset to default
      document.body.style.overflow = ''; // Reset to default
      listItems.forEach(item => {
        item.style.opacity = '';
      });

    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// ------------------- RESET URL

function resetURLButtonClickHandler() {
  try {
    console.log('Resetting URL...');
    // Reset the saved URL in extension storage
    browser.storage.local.remove('savedURL').then(() => {
      console.log('URL reset.');
    }).catch(error => {
      console.error('Error resetting URL:', error);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
document.addEventListener('DOMContentLoaded', function () {
    const resetURLButton = document.getElementById('resetURLButton');
    resetURLButton.addEventListener('click', resetURLButtonClickHandler);
});



// ------------------- Tab Walker UI -------------------------------
 
function openTabWalker() {
  const overlay = document.querySelector('.overlay');
  const tablistul = document.querySelector('.tablistul');
  const buttonLayout = document.getElementById('buttonLayout');
  const listLayout = document.getElementById('listLayout');
  buttonLayout.style.display = 'flex';
  listLayout.style.display = 'none';
  overlay.style.display = 'flex';
  tablistul.style.display = 'inline-block';
  statustabwalker = 'opened';

  const tabList = document.getElementById('tabList');

// ------------------- clear tabs list first
  tabList.innerHTML = '';
  
// ------------------- get tab info + favicon
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    tabs.forEach((tab) => {

      const listItem = document.createElement('li');
      listItem.classList.add('tab-list-item');

// ------------------- create favicon

      const faviconImg = document.createElement('img');
      faviconImg.src = tab.favIconUrl;
      faviconImg.alt = '⚪';
      faviconImg.title = 'Click Tab / RightClk to Close / MiddleClk to Unload';
      faviconImg.width = 20;
      faviconImg.height = 20;
      faviconImg.style.maxWidth = '20px';
      faviconImg.style.maxHeight = '20px';
      if (!tab.favIconUrl || !tab.url.startsWith('http')) {
        faviconImg.src = 'css&ico/website.png';
      }
      listItem.appendChild(faviconImg);
      
// ------------------- audio indicator

      const audioIndicator = document.createElement('img');
      audioIndicator.src = 'css&ico/audio.gif';
      audioIndicator.alt = '🔊';
      audioIndicator.title = 'Click Tab / RightClk to Close / MiddleClk to Unload';
      audioIndicator.height = 20;
      audioIndicator.style.maxHeight = '20px';
      audioIndicator.style.marginRight = '5px';
      audioIndicator.style.marginLeft = '0px';
      audioIndicator.style.cursor = 'pointer';
      
      if (tab.audible || tab.mutedInfo.muted) {
        listItem.appendChild(audioIndicator);
      }
      if (tab.mutedInfo.muted) {
        listItem.appendChild(audioIndicator);
        audioIndicator.style.filter = 'brightness(0.1)';
        audioIndicator.style.color = '#202020'; 
      }
      
// ------------------- click to mute/unmute

      audioIndicator.addEventListener('click', () => {
        
        chrome.tabs.get(tab.id, (updatedTab) => {
        if (!updatedTab.mutedInfo.muted) {
            chrome.tabs.update(tab.id, { muted: true }, () => {
                audioIndicator.style.filter = 'brightness(0.1)';
                audioIndicator.style.color = '#202020';
                console.log('Tab Muted:');
            });
        } else {
            chrome.tabs.update(tab.id, { muted: false }, () => {
                audioIndicator.style.filter = 'brightness(1)';
                audioIndicator.style.color = 'yellow';
                console.log('Tab Unmuted');
            });
        }
      });
    });
      
// ------------------- tab title

      const titleSpan = document.createElement('span');
      titleSpan.textContent = tab.title;
      if (tab.discarded) {
        faviconImg.style.filter = 'brightness(0.3)';
        titleSpan.style.color = '#202020'; // GREY OUT UNLOADED TAB 
      }
      listItem.appendChild(titleSpan);

// ------------------- Click to go

      titleSpan.addEventListener('click', () => {
        chrome.tabs.update(tab.id, { active: true });
        window.close();
      });
      faviconImg.addEventListener('click', () => {
        chrome.tabs.update(tab.id, { active: true });
        window.close();
      });
      
// ------------------- Middle Click to close

      titleSpan.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
          chrome.tabs.remove(tab.id);
          tabList.removeChild(listItem);
        }
      });

      faviconImg.addEventListener('mousedown', (event) => {
        if (event.button === 1) {
          chrome.tabs.remove(tab.id);
          tabList.removeChild(listItem);
        }
      });


// ------------------- Right Click to unload

      titleSpan.addEventListener('contextmenu', (event) => {
        event.preventDefault(); 
        chrome.tabs.discard(tab.id);
        faviconImg.style.filter = 'brightness(0.3)';
        titleSpan.style.color = '#202020'; // GREY OUT UNLOADED TAB
        faviconImg.style.color = '#202020';
      });
      tabList.appendChild(listItem);
      faviconImg.addEventListener('contextmenu', (event) => {
        event.preventDefault(); 
        chrome.tabs.discard(tab.id);
        faviconImg.style.filter = 'brightness(0.3)';
        titleSpan.style.color = '#202020'; // GREY OUT UNLOADED TAB
        faviconImg.style.color = '#202020';
      });
      tabList.appendChild(listItem);
    });
    

// ------------------- ADJUST body depending on tab amount

    const numTabs = tabs.length;
    const minHeight = 61; // Minimum height for the body
    const tabHeight = 28; // Height per tab
    let height = Math.max(minHeight + numTabs * tabHeight, minHeight);

    // Set body overflow based on the height
    if (height > 600) {
      height = 600; // Limit height to 600
    } else {
      document.body.style.overflow = 'hidden';
    }
    
// ------------------- SET the body height

    document.body.style.height = height + 'px';
  });
}
// ------------------- listen for new tabs / closed tabs

chrome.tabs.onCreated.addListener((tab) => { openTabWalker(); });
chrome.tabs.onRemoved.addListener((tabId) => { openTabWalker(); });

// ------------------- listen for keyboard trigger from background script (F2)

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "open_tab_walker") {
    // Handle the message here, e.g., trigger openTabWalker function
    openTabWalker();
  }
});
// ------------------- placeholder, probably dont need
function revertToDefaultPopup() {
  window.location.reload();
}

// ------------------- 


// Light mode dark mode implementation

browser.storage.local.get('lightdarkmode').then(result => {
  if (!result.lightdarkmode) {
    browser.storage.local.set({ 'lightdarkmode': 'dark' });
  } else {
    LightorDark(result.lightdarkmode);
  }
});

function LightorDark(mode) {
  const body = document.body;
  if (mode === 'dark') {
    body.style.backgroundColor = 'black';
    body.classList.remove('light-mode');
    
  } else {
    body.style.backgroundColor = '#d5dee8';
    body.classList.add('light-mode');
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.classList.add('light-mode');
    });
    const listItems = document.querySelectorAll('.list-item');
    const tablistul = document.querySelector('.tablistul');
    listItems.forEach(item => {
      item.classList.add('light-mode');
    });
  }
  
  // Save the mode to storage
  browser.storage.local.set({ 'lightdarkmode': mode });
}


function toggleLight() {
  browser.storage.local.get('lightdarkmode').then(result => {
    const currentMode = result.lightdarkmode || 'dark'; // Default to dark mode if not set
    const newMode = currentMode === 'dark' ? 'light' : 'dark'; 
    LightorDark(newMode);
  }).catch(error => {
    console.error('Error toggling light/dark mode:', error);
  });
}















// -------------------  -------------------------------



// -------------------  -------------------------------

