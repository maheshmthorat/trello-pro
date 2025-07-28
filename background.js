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
chrome.runtime.onInstalled.addListener(function (details) {
   if (details.reason === 'install') {
      chrome.storage.sync.set({
         cardCountInList: true,
         cardTotalCount: true,
         hideCardCover: false
      }, function () {
         console.log('Default options set on install');
      });
   }
});
