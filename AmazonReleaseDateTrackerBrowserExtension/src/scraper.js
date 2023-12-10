//const myBaseUrl = "http://www.einsoftdev.com/";
const myBaseUrl = "http://localhost/";

function changeTopLevelDomain(url) {
  const urlParts = url.split("/");

  const importantParts = urlParts.slice(3);
  return "https://www.amazon.com/" + importantParts.join("/");
}

function saveOnServer(bookTitle, releaseDate, url) {
  console.log("Saving on Server!");
  const data = { bookTitle: bookTitle, releaseDate: releaseDate, url: url };

  const reqUrl = myBaseUrl + "AmazonReleaseDateTracker/trackBook";

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
      console.log(html);
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
  const url = myBaseUrl + "AmazonReleaseDateTracker/IsLoggedIn";
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
