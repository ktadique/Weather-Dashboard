//API variables
let cityName = [];

let todayDiv = $("#today");
let forecastDiv = $("#forecast");
let cityHistory = $("#history");
//AJAX
function renderForecast() {
  let apiKey = "690c3a6b7201e389fe103be085cb462f";
  let city = $("#search-input").val();
  let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response.list[0]); //Test if correct
    let currentForcast = response.list[0];
    let kelvin = currentForcast.main.temp;
    let celcius = kelvin - 273.15;

    let todayCard = $("<div>").attr("class", "card");
    let todayCardBody = $("<div>").attr("class", "card-body");
    let cityHeading = $("<h4>").attr("class", "font-weight-bold");
    cityHeading.text(`${city}  ${currentDay}`);
    let todayTemp = $("<p>");
    todayTemp.text(`Temp: ${celcius}`);
    let todayWind = $("<p>");
    todayWind.text(`Wind: ${currentForcast.wind.speed}`);
    let todayHumi = $("<p>");
    todayHumi.text(`Humidity: ${currentForcast.main.humidity}`);

    todayDiv.append(todayCard);
    todayCard.append(todayCardBody);
    todayCardBody.append(cityHeading, todayTemp, todayWind, todayHumi);
  });
}

//moment.js
let currentHour = moment().hour();
let currentDay = moment().format("DD/MM/YY");

/* //Todays forcast
// let todayCard = $("<div>").attr("class", "card");
// let todayCardBody = $("<div>").attr("class", "card-body");
// let cityHeading = $("<h4>").attr("class", "font-weight-bold");
// cityHeading.text(`${cityName}  ${currentDay}`);
// let todayTemp = $("<p>");
// todayTemp.text(`Temp: `);
// let todayWind = $("<p>");
// todayWind.text(`Wind: `);
// let todayHumi = $("<p>");
// todayHumi.text(`Humidity: `);

// todayDiv.append(todayCard);
// todayCard.append(todayCardBody);
// todayCardBody.append(cityHeading, todayTemp, todayWind, todayHumi);
 */
//5-Day forecast
let forecastHeading = $("<h4>").attr("class", "font-weight-bold");
forecastHeading.text("5-Day Forecast:");
let forecastDeck = $("<div>").attr("class", "card-deck");
let forecastCard = $("<div>").attr("class", "card");
let forecastCardBody = $("<div>").attr("class", "card-body");
let forecastDate = $("<h5>");
forecastDate.text(currentDay);
let forecastTemp = $("<p>");
forecastTemp.text(`Temp: `);
let forecastWind = $("<p>");
forecastWind.text(`Wind: `);
let forecastHumi = $("<p>");
forecastHumi.text(`Humidity: `);

forecastDiv.append(forecastHeading, forecastDeck);
forecastDeck.append(forecastCard);
forecastCard.append(forecastCardBody);
forecastCardBody.append(forecastDate, forecastTemp, forecastWind, forecastHumi);

function renderCityButtons() {
  cityHistory.empty();
  for (i = 0; i < cityName.length; i++) {
    let cityButton = $("<li>");

    cityButton.text(cityName[i]);

    cityButton.addClass("btn btn-outline-dark mb-1 city-btn");

    cityButton.attr("data-city", cityName[i]);

    cityHistory.append(cityButton);
  }
}

$("#search-form").on("submit", function (event) {
  let input = $("#search-input").val();
  event.preventDefault();

  cityName.push(input);

  renderCityButtons();
  todayDiv.empty();
  renderForecast();
});

//geocoding api?
// "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=" +
