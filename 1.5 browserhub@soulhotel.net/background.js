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
