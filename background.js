// --------------- context menu (right click menu) options ---------------

// --------------- close tab

browser.contextMenus.create({
  id: "contextitem-closetab",
  title: "Close This Tab",
  contexts: ["page"]  // Change "tab" to "all"
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  console.log("Context menu item clicked:", info);
  if (info.menuItemId === "contextitem-closetab") {
    console.log("Closing tab:", tab.id);
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      if (tabs.length > 0) {
        const currentTabId = tabs[0].id;
        browser.tabs.remove(currentTabId).then(() => {
          const previousTabId = tab.id;
          browser.tabs.update(previousTabId, { active: true });
        });
      }
    }).catch(error => console.error("Error closing tab:", error));
  }
});

// --------------- set browser hub url

browser.contextMenus.create({
  id: "contextitem-saveurl",
  title: "Save Link to Browser Hub",
  contexts: ["link"]
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "contextitem-saveurl") {
    console.log("Saving URL to Browser Hub:", info.linkUrl);
    saveURLToExtension(info.linkUrl);
  }
});

function saveURLToExtension(url) {
  try {

    if (url) {
      browser.storage.local.set({ 'savedURL': url }).then(() => {
        console.log('URL saved:', url);
      }).catch(error => {
        console.error('Error saving URL:', error);
      });
    } else {
      console.log('No URL provided.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

chrome.commands.onCommand.addListener(function(command) {
  if (command === "open_tab_walker") {
    chrome.action.openPopup();
    setTimeout(function() {
      chrome.runtime.sendMessage({ action: "open_tab_walker" });
    }, 100); // Adjust the delay time as needed
  }
});








// --------------- unload tab


browser.contextMenus.create({
    id: "unload-tab",
    title: "Put Tab to Sleep",
    contexts: ["tab"]
});

var upid = 0;

browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "unload-tab") {
		let active = browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
			if (tabs[0].id == tab.id){
			let next = browser.tabs.query({index:tabs[0].index + 1, currentWindow: true}).then((tab2) => {
					var ind = tab2[0].id
				  var updating = browser.tabs.update(ind, { active: true }).then((done) => {
					  browser.tabs.discard(tab.id);
				  })
				
			})
			} else {
				browser.tabs.discard(tab.id);
			}
		})
    }
});




