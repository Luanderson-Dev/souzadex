(function () {
  "use strict";

  var counts = {};
  SOUZAS.forEach(function (souza) {
    if (!counts[souza.author]) {
      counts[souza.author] = { author: souza.author, authorId: souza.authorId, count: 0 };
    }
    counts[souza.author].count++;
  });

  var ranked = Object.keys(counts)
    .map(function (key) { return counts[key]; })
    .sort(function (a, b) { return b.count - a.count; });

  var list = document.getElementById("ranking-list");

  ranked.forEach(function (entry, index) {
    var rank = index + 1;
    var avatarUrl = entry.authorId
      ? "https://avatars.githubusercontent.com/u/" + entry.authorId + "?s=128"
      : "https://github.com/" + entry.author + ".png?size=128";

    var item = document.createElement("div");
    item.className = "ranking-item";
    if (rank === 1) item.classList.add("ranking-item--gold");
    else if (rank === 2) item.classList.add("ranking-item--silver");
    else if (rank === 3) item.classList.add("ranking-item--bronze");

    var label = entry.count === 1 ? "imagem" : "imagens";

    item.innerHTML =
      '<span class="ranking-position">' + rank + '</span>' +
      '<img class="ranking-avatar" src="' + avatarUrl + '" alt="' + entry.author + '" width="48" height="48" loading="lazy">' +
      '<a class="ranking-name" href="https://github.com/' + entry.author + '" target="_blank" rel="noopener">' + entry.author + '</a>' +
      '<span class="ranking-count">' + entry.count + ' ' + label + '</span>';

    list.appendChild(item);
  });
})();
