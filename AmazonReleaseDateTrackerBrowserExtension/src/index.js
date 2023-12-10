console.log("Site called!");

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
