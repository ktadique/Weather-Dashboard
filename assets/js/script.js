//------------------
// To-do/psuedo code
/* 
user inputs city
city added to query url
ajax call uses queryurl to retieve payload
save city into button
save city forecast into local storage
when new city is searched
clear current divs
display new city forecast

*/
//-----------------

//API variables
let cityName = [];

//moment.js
let currentHour = moment().hour();
let currentDay = moment().format("DD/MM/YY");

let todayDiv = $("#today");
let forecastDiv = $("#forecast");
let cityHistory = $("#history");
let searchBtn = $("#search-button");
let apiKey = "&appid=690c3a6b7201e389fe103be085cb462f";

function findCity() {
  let city = $("#search-input").val();
  let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}${apiKey}`;

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    // console.log(response); //Test if correct
    renderForecast(response);

    /* //render future forecast
    renderForecast(response);
    //render 5-day forcast
    futureForecast(response); */
  });
}

function renderForecast(response) {
  let todayCard = $("<div>").attr("class", "card");
  let todayCardBody = $("<div>").attr("class", "card-body");
  let cityHeading = $("<h4>").attr("class", "font-weight-bold");
  cityHeading.text(`${response.name}  ${currentDay}`);
  let currentForcast = response.list[0];
  let kelvin = currentForcast.main.temp;
  let celcius = `${kelvin - 273.15}\u00B0C`;
  let todayTemp = $("<p>");
  todayTemp.text(`Temp: ${celcius}`);
  let todayWind = $("<p>");
  todayWind.text(`Wind: ${currentForcast.wind.speed} KPH`);
  let todayHumi = $("<p>");
  todayHumi.text(`Humidity: ${currentForcast.main.humidity}%`);

  todayDiv.append(todayCard);
  todayCard.append(todayCardBody);
  todayCardBody.append(cityHeading, todayTemp, todayWind, todayHumi);
}

//5-Day forecast
function futureForecast(response) {
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
  forecastCardBody.append(
    forecastDate,
    forecastTemp,
    forecastWind,
    forecastHumi
  );
}

function renderCityButtons() {
  let input = $("#search-input").val();
  //push input into cityName array
  cityName.push(input);

  console.log(cityName);
  cityHistory.empty();

  for (i = 0; i < cityName.length; i++) {
    let cityButton = $("<li>");

    cityButton.text(cityName[i]);

    cityButton.addClass("btn btn-outline-dark mb-1 city-btn");

    cityButton.attr("data-city", cityName[i]);

    cityHistory.append(cityButton);
  }
}

function getPastForcast(event) {
  let input = $(event.target).attr("data-city");
  alert("you clicked " + input); //test
  let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${input}${apiKey}`;

  todayDiv.empty();

  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    let currentForcast = response.list[0];
    let kelvin = currentForcast.main.temp;
    let celcius = `${kelvin - 273.15}\u00B0C`;

    let todayCard = $("<div>").attr("class", "card");
    let todayCardBody = $("<div>").attr("class", "card-body");
    let cityHeading = $("<h4>").attr("class", "font-weight-bold");
    cityHeading.text(`${input}  ${currentDay}`);
    let todayTemp = $("<p>");
    todayTemp.text(`Temp: ${celcius}`);
    let todayWind = $("<p>");
    todayWind.text(`Wind: ${currentForcast.wind.speed} KPH`);
    let todayHumi = $("<p>");
    todayHumi.text(`Humidity: ${currentForcast.main.humidity}%`);

    todayDiv.append(todayCard);
    todayCard.append(todayCardBody);
    todayCardBody.append(cityHeading, todayTemp, todayWind, todayHumi);
  });
}

//event listeners

searchBtn.on("click", function (event) {
  event.preventDefault();
  renderCityButtons();
  todayDiv.empty();
  findCity();
});

cityHistory.on("click", ".city-btn", getPastForcast);

//geocoding api?
// "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=" +

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
