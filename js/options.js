function save_options() {
   let cardCountInList = document.getElementById('cardCountInList').checked;
   let cardTotalCount = document.getElementById('cardTotalCount').checked;
   let hideCardCover = document.getElementById('hideCardCover').checked;

   let trelloUI = document.querySelector('input[name="trello_ui"]:checked')?.id?.replace('trelloUI-', '') || 'newUI';

   chrome.storage.sync.set({
      cardCountInList: cardCountInList,
      cardTotalCount: cardTotalCount,
      hideCardCover: hideCardCover,
      trello_ui: trelloUI,
   }, function () {
      let status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function () {
         status.textContent = '';
      }, 750);
   });
}

function restore_options() {
   chrome.storage.sync.get({
      trello_ui: 'newUI',
      cardCountInList: true,
      cardTotalCount: true,
      hideCardCover: false,
   }, function (items) {
      document.getElementById('cardCountInList').checked = items.cardCountInList;
      document.getElementById('cardTotalCount').checked = items.cardTotalCount;
      document.getElementById('hideCardCover').checked = items.hideCardCover;

      let radioToCheck = document.getElementById(`trelloUI-${items.trello_ui}`);
      if (radioToCheck) {
         radioToCheck.checked = true;
      }
   });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
