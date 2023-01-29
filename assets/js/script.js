//------------------
// To-do/psuedo code
/* 
user inputs city
city added to query url
ajax call uses queryurl to retieve payload
save city into button
when new city is searched
clear current divs
display new city forecast
when previous city button is pressed
clear current divs
display past city current forecast
*/
//-----------------

//moment.js
let currentHour = moment().hour();
let currentDay = moment().format("DD/MM/YY");

let todayDiv = $("#today");
let forecastDiv = $("#forecast");
let cityHistory = $("#history");
let searchBtn = $("#search-button");
let cityName = [];

function findCity(event) {
  event.preventDefault();
  let city = $("#search-input").val();
  let apiKey = "&appid=690c3a6b7201e389fe103be085cb462f";
  let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}${apiKey}`;

  todayDiv.empty();
  forecastDiv.empty();
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response); //Test if correct
    renderForecast(response);
    /* //render 5-day forcast
    futureForecast(response); */
    futureForecast();
  });
  //generate button into city history
  renderCityButtons();
}

function renderForecast(response) {
  //create main forecast elements
  let todayCard = $("<div>").attr("class", "card");
  let todayCardBody = $("<div>").attr("class", "card-body");

  //main forecast information
  //heading
  let cityHeading = $("<h4>").attr("class", "font-weight-bold");
  cityHeading.text(`${response.city.name}  (${currentDay})`);
  //temp
  let currentForcast = response.list[0];
  let kelToCel = currentForcast.main.temp - 273.15;
  let celcius = Math.round(kelToCel * 10) / 10;
  let todayTemp = $("<p>");
  todayTemp.text(`Temp: ${celcius}°C`);
  //weather icon
  let icon = $("<img>");
  let fcIcon = currentForcast.weather[0].icon;
  icon.attr(
    { src: `http://openweathermap.org/img/wn/${fcIcon}@2x.png` },
    { alt: `${currentForcast.weather[0].description}` },
    { width: "50" },
    { height: "50" }
  );
  cityHeading.append(icon);
  //wind
  let todayWind = $("<p>");
  todayWind.text(`Wind: ${currentForcast.wind.speed} KPH`);
  //humidity
  let todayHumi = $("<p>");
  todayHumi.text(`Humidity: ${currentForcast.main.humidity}%`);

  todayDiv.append(todayCard);
  todayCard.append(todayCardBody);
  todayCardBody.append(cityHeading, todayTemp, todayWind, todayHumi);
}

//5-Day forecast
function futureForecast() {
  let forecastHeading = $("<h4>").attr("class", "font-weight-bold");
  forecastHeading.text("5-Day Forecast:");
  let forecastDeck = $("<div>").attr("class", "card-deck");
  forecastDiv.append(forecastHeading, forecastDeck);

  for (let i = 0; i < 5; i++) {
    //create forecast cards
    let forecastCard = $("<div>").attr("class", `card fc-${i}`);
    let forecastCardBody = $("<div>").attr("class", "card-body");

    //forecast card information
    let nextDay = moment().add(i, "d");
    let forecastDate = $("<h5>");
    forecastDate.text(nextDay.format("DD/MM/YY"));
    let forecastTemp = $("<p>");
    forecastTemp.text(`Temp: `);
    let forecastWind = $("<p>");
    forecastWind.text(`Wind: `);
    let forecastHumi = $("<p>");
    forecastHumi.text(`Humidity: `);

    //append info to cards, cards to forecast deck
    forecastDeck.append(forecastCard);
    forecastCard.append(forecastCardBody);
    forecastCardBody.append(
      forecastDate,
      forecastTemp,
      forecastWind,
      forecastHumi
    );
  }
}

function renderCityButtons() {
  let input = $("#search-input").val();
  //push input into cityName array
  cityName.push(input);

  cityHistory.empty();

  //create a button for every item in array
  for (i = 0; i < cityName.length; i++) {
    let cityButton = $("<li>");

    cityButton.text(cityName[i]);

    cityButton.addClass("btn btn-outline-dark mb-1 city-btn");

    cityButton.attr("data-city", cityName[i]);

    cityHistory.append(cityButton);
  }
}

//Retrieve past searches when city button is pressed
function getPastForcast(event) {
  let input = $(event.target).attr("data-city");
  alert("you clicked " + input); //test
  let apiKey = "&appid=690c3a6b7201e389fe103be085cb462f";
  let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${input}${apiKey}`;

  todayDiv.empty();
  forecastDiv.empty();
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
  futureForecast();
}

//event listeners

searchBtn.on("click", findCity);
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
