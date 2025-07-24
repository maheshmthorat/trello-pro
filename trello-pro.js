function init() {
  chrome.storage.sync.get(null).then((options) => {
    change(options);
  });
}

setInterval(function () {
  init();
}, 2000);

init();

function showCardId(cardHref, card) {
  let match = cardHref.match(/\/(\d+)-/);
  if (match) {
    card.innerHTML = card.innerHTML.replace(/<b class="card-short-id">#\d+<\/b>/, '');

    card.innerHTML = `<b class="card-short-id">#${match[1]}</b> ${card.innerHTML}`
  }
}

function showCardCountInList() {
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

    listName.innerHTML = listName.innerHTML.replace(/<div class="card-count-in-list">\d+\scards?<\/div>/, '');

    listName.innerHTML = listName.innerHTML + cardCountLabel;
  }

  showTotalCardCount(totalCount);
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
  if (!options['cardCountInList']) {
    document.querySelectorAll('li[data-testid=\"list-card\]');
    showCardCountInList()
  }
}
