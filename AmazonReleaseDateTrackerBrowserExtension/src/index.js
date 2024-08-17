console.log("Site called!");

//const myBaseUrl = "http://localhost/";
const myBaseUrl = "http://www.einsoftdev.com/";

function changeTopLevelDomain(url) {
  const urlParts = url.split("/");

  const importantParts = urlParts.slice(3);
  return "https://www.amazon.com/" + importantParts.join("/");
}

function saveOnServer(bookTitle, releaseDate, url) {
  console.log("Saving on Server!");
  const data = { bookTitle: bookTitle, releaseDate: releaseDate, url: url };

  const reqUrl = myBaseUrl + "AmazonReleaseDateTracker/api/trackBook";

  $.ajax({
    type: "POST",
    url: reqUrl,
    data: data,
  })
    .done(function (data, status, jqXHR) {
      // Do your stuff
    })
    .fail(function (data, status, jqXHR) {
      alert("Sorry, can't currently reach Server :(");
    })
    .always(function (data, status, jqXHR) {});
}

function handleAmazonURL(url, onDone) {
  const correctUrl = changeTopLevelDomain(url);
  
  try {
    $.get(url, function (html) {
      //var html = sanitize(html);
      const productTitle = $(html).find("#productTitle").text();

      const releaseDate = $(html)
        .find("#rpi-attribute-book_details-publication_date")
        .find(".rpi-attribute-value")
        .text();

      saveOnServer(productTitle, releaseDate, url);

      onDone();
    });
  } catch (e) {
    console.log("failed to parse Amazon source");
    console.log(e);
  }
}

function loginIfNecessary(fnLogin) {
  const url = myBaseUrl + "AmazonReleaseDateTracker/api/IsLoggedIn";
  try {
    $.get(url, function (response) {
      console.log("response:", response);
      if (response == "FALSE") {
        fnLogin();
      }
    });
  } catch (e) {
    console.log("failed to check if login is neccessary");
    console.log(e);
  }
}

async function getCurrentTab() {
  let queryOptions = { active: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

/**
 * @param {Boolean} success message type: success?
 * @param {string} msg The string
 */
function toggleNotifier(msgClass, msg) {
  console.log(msg);

  const popupMessager = $("#popupMessager");
  popupMessager.removeClass();
  popupMessager.addClass("alert");
  popupMessager.addClass(msgClass);
  popupMessager.text(msg);

  popupMessager.show();
}

function onBtnWatchBookClicked() {
  var promise1 = getCurrentTab();

  promise1.then((res) => {
    console.log(res);

    try {
      var url = new URL(res.url);

      // check if url matches
      var regex = "https://www.amazon.*";
      if (url.origin.match(regex)) {
        var urlString = res.url;
        var title = res.title;

        toggleNotifier("alert-dark", "Adding Book ...");
        // TODO: ADD delay
        handleAmazonURL(urlString, () => {
          toggleNotifier("alert-success", "Book was added to Watchlist!");
        });
      } else {
        throw "No Amazon book";
      }
    } catch (error) {
      if (error == "No Amazon book") {
        toggleNotifier("alert-danger", "Can only handle Amazon Books/Audibles");
      } else {
        throw error;
      }
    }
  });
}

function onBtnShowBooksClicked() {
  const newURL = myBaseUrl + "AmazonReleaseDateTracker/";
  chrome.tabs.create({ url: newURL });
  console.log("Showing tracked books");
}

$(document).ready(function () {
  loginIfNecessary(() => {
    const newURL = myBaseUrl + "AmazonReleaseDateTracker/login";
    chrome.tabs.create({ url: newURL });

    console.log("login necessary!");
  });
  $("#btnWatchBook").click(onBtnWatchBookClicked);
  $("#btnShowBooks").click(onBtnShowBooksClicked);
});
