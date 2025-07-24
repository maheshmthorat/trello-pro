function change(tabId, key, cssFile) {
   chrome.storage.sync.get(key, function (item) {
      if (!item[key]) {
         chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: [cssFile],
         });
      }
   });
}