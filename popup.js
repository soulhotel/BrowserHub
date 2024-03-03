// --------------- Event Listeners for button clicks ---------------

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("closetabbtn").addEventListener("click", closeCurrentTab);
    document.getElementById("undoclosebtn").addEventListener("click", undoClosedTab);
    document.getElementById("fullbtn").addEventListener("click", toggleFullScreen);
    document.getElementById("tabbtn").addEventListener("click", newTab);
    document.getElementById("windowbtn").addEventListener("click", newWindow);
    document.getElementById("privatebtn").addEventListener("click", newPrivate);
    document.getElementById("saveURLbtn").addEventListener("click", saveURLButtonClickHandler);
    
    document.getElementById("tabli").addEventListener("click", newTab);
    document.getElementById("windowli").addEventListener("click", newWindow);
    document.getElementById("privateli").addEventListener("click", newPrivate);
    document.getElementById("fullli").addEventListener("click", toggleFullScreen);
    document.getElementById("undocloseli").addEventListener("click", undoClosedTab);
    document.getElementById("closeli").addEventListener("click", closeCurrentTab);
    document.getElementById("saveURLli").addEventListener("click", saveURLButtonClickHandler);
});

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
      isButtonLayout = savedLayoutPreference === 'button'; // Update the layout based on the stored preference
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
        const urlToOpen = savedURL.savedURL || "https://web.tabliss.io/";
        console.log('Opening URL:', urlToOpen);
        chrome.tabs.create({ url: urlToOpen });
    } catch (error) {
        console.error('Error:', error);
    }
}

// --------------- For window button ---------------

async function newWindow() {
    try {
        const savedURL = await browser.storage.local.get('savedURL');
        const urlToOpen = savedURL.savedURL || "https://web.tabliss.io/";
        console.log('Opening URL in new window:', urlToOpen);
        chrome.windows.create({
            url: urlToOpen,
            type: "normal",
            focused: true
        });
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
    console.log('Opening dialog container...');
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