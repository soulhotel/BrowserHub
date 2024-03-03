chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'openDevToolsInNewTab') {
    chrome.tabs.create({ url: 'chrome-devtools://devtools/bundled/inspector.html' });
  }
});