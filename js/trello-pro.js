function init() {
  try {
    if (chrome?.storage?.sync) {
      chrome.storage.sync.get(null).then((options) => {
        change(options);
      });
    }
  } catch (err) {
    // console.error('Extension context invalidated or storage not accessible:', err);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "reinit") {
    init();
  }
});

var interval = setInterval(function () {
  init();
}, 3000);

document.addEventListener('DOMContentLoaded', function () {
  init();
});

function showCardId(cardHref, card) {
  let match = cardHref.match(/\/(\d+)-/);
  if (match) {
    card.innerHTML = card.innerHTML.replace(/<b class="card-short-id">#\d+<\/b>/, '');

    card.innerHTML = `<b class="card-short-id">#${match[1]}</b> ${card.innerHTML}`
  }
}

function showCardCountInList(options) {
  let lists = document.querySelectorAll("div[data-testid=\"list\"]");
  let totalCount = 0;
  for (let index = 0; index < lists.length; index++) {
    let list = lists[index];
    let cardCount = list.querySelectorAll("li[data-testid=\"list-card\"]").length;
    totalCount += cardCount;
    let listName = list.querySelector("h2[data-testid=\"list-name\"]");
    let cardCountLabel;
    if (cardCount === 1) {
      cardCountLabel = `<div class="card-count-in-list">${cardCount} card</div>`;
    } else {
      cardCountLabel = `<div class="card-count-in-list">${cardCount} cards</div>`;
    }

    if (options['cardCountInList']) {
      listName.innerHTML = listName.innerHTML.replace(/<div class="card-count-in-list">\d+\scards?<\/div>/, '');
      listName.innerHTML = listName.innerHTML + cardCountLabel;
    }
  }

  if (options['cardTotalCount']) {
    showTotalCardCount(totalCount);
  }
}

function showTotalCardCount(totalCount) {
  const target = document.querySelector('[data-testid="board-name-container"]');
  if (document.querySelector('.card-count-total')) {
    document.querySelector('.card-count-total').remove();
  }
  if (target) {
    const newDiv = document.createElement('div');
    newDiv.textContent = `Total Cards: ${totalCount}`;
    newDiv.classList.add('card-count-total');
    target.insertAdjacentElement('afterend', newDiv);
  }
}

function change(options) {
  showCardCountInList(options)
  if (!options['cardCountInList']) {
    document.querySelectorAll('.card-count-in-list').forEach((item) => item.remove());
  }
  if (!options['cardTotalCount'] && document.querySelector('.card-count-total')) {
    document.querySelector('.card-count-total').remove();
  }
  trelloLayoutUI(options['trello_ui']);
  if (options['hideCardCover']) {
    hideCardsCover();
  }
  else {
    if (document.getElementById("trello-pro-hide-covers-style")) document.getElementById("trello-pro-hide-covers-style").remove();
  }
}

var loadBoardSearch = setInterval(function () {
  hookLoadBoardSearch();
}, 1000);

function hookLoadBoardSearch() {
  const appendElement = document.querySelector('header ul');
  if (!document.querySelector('.boardSearch') && appendElement) {
    appendElement.insertAdjacentHTML('afterend', `
<ul>
  <li>
    <button class="boardSearch">
      <svg fill="none" viewBox="0 0 16 16" role="presentation" class="_1reo15vq _18m915vq _syaz1r31 _lcxvglyw _s7n4yfq0 _vc881r31 _1bsbpxbi _4t3ipxbi">
        <path fill="currentcolor" fill-rule="evenodd" d="M2 3.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h1.833v-7zm3.333 0v7h2.334v-7zm3.834 0v7H11a.5.5 0 0 0 .5-.5V4a.5.5 0 0 0-.5-.5zM0 4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm14.5 7.75V7H16v4.75A3.25 3.25 0 0 1 12.75 15H5v-1.5h7.75a1.75 1.75 0 0 0 1.75-1.75" clip-rule="evenodd"></path>
      </svg>
      Board Search
    </button>
  </li>
</ul>
`);
    document.querySelector('.boardSearch').addEventListener('click', () => {
      const bKeyEvent = new KeyboardEvent('keydown', {
        key: 'b',
        code: 'KeyB',
        keyCode: 66,
        which: 66,
        bubbles: true,
        cancelable: false
      });
      document.querySelector('button').dispatchEvent(bKeyEvent);
    });

  }
}


function trelloLayoutUI(option) {
  if (document.getElementById("trello-pro-ui-style")) { document.getElementById("trello-pro-ui-style").remove(); };
  let styleContent = '';
  if (!option) {
    option = newUI;
  }
  if (option == 'default') {
    styleContent = ``;
  }
  else if (option == 'newUI') {
    styleContent = `
    main{
      width: 30% !important;
    }
    aside > div {
      width: 100% !important;
    }
    `;
  } else if (option == 'oldUI') {
    styleContent = `

[aria-labelledby="card-back-name"] {
  width: 800px !important;
}

[aria-labelledby="card-back-name"] > div > div {
  display: block !important;
  max-height: 100% !important;
}

[aria-labelledby="card-back-name"] > div > div > div {
  display: block !important;
  height: auto !important;
  overflow: visible !important;
}
[aria-labelledby="card-back-name"] nav {
  z-index: 999999999 !important;
  top: 0 !important;
}
aside,
aside > div {
  width: 100% !important;
}

main > div {
  width: 100% !important;
  min-width: 100% !important;
  max-width: 100% !important;
}
`;
  }
  const style = document.createElement("style");
  style.id = "trello-pro-ui-style";
  style.textContent = styleContent;
  document.head.appendChild(style);
}


function hideCardsCover() {
  if (document.getElementById("trello-pro-hide-covers-style")) return;

  const style = document.createElement("style");
  style.id = "trello-pro-hide-covers-style";
  style.textContent = `
    div[data-card-front-section="cover"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}
