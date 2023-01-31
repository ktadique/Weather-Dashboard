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
let currentDay = moment().format("DD/MM/YY");

let todayDiv = $("#today");
let forecastDiv = $("#forecast");
let cityHistory = $("#history");
let searchBtn = $("#search-button");
let cityNames = [];

init();

function init() {
  let storedCity = JSON.parse(localStorage.getItem("cityHistory"));

  //check if there is an item in local storage
  if (storedCity) {
    cityNames = storedCity;
  }
  renderCityButtons();
}

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
    //render main forecast
    renderForecast(response);
    //render 5-day forecast
    renderFutureForecast(response);

    //If input is empty or has already been searched throw error
    if (city === "") {
      alert("Please enter a city name");
    } else if (cityNames.includes(city)) {
      alert("Please enter a new city name");
    } else {
      //push input into cityNames array
      cityNames.push(city);
      // save citynames array into local storage
      localStorage.setItem("cityHistory", JSON.stringify(cityNames));
      //render city button
      renderCityButtons();
    }
  });
}
//Main city forecast
function renderForecast(response) {
  let currentForecast = response.list[0];
  console.log(response);
  //create main forecast elements
  let todayCard = $("<div>").attr("class", "card text-white shadow bg-info");
  let todayCardBody = $("<div>").attr("class", "card-body");

  //main forecast information
  //heading
  let cityHeading = $("<h4>").attr("class", "font-weight-bold");
  cityHeading.text(`${response.city.name}  (${currentDay})`);
  //temp conversion
  let kelToCel = currentForecast.main.temp - 273.15;
  let celcius = Math.round(kelToCel * 10) / 10;
  //temp
  let todayTemp = $("<p>");
  todayTemp.text(`Temp: ${celcius}°C`);
  //weather icon
  let icon = $("<img>");
  let fcIcon = currentForecast.weather[0].icon;
  icon.attr({
    src: `http://openweathermap.org/img/wn/${fcIcon}@2x.png`,
    alt: `${currentForecast.weather[0].description}`,
  });
  cityHeading.append(icon);
  //wind
  let todayWind = $("<p>");
  todayWind.text(`Wind: ${currentForecast.wind.speed} KPH`);
  //humidity
  let todayHumi = $("<p>");
  todayHumi.text(`Humidity: ${currentForecast.main.humidity}%`);

  //append elements
  todayDiv.append(todayCard);
  todayCard.append(todayCardBody);
  todayCardBody.append(cityHeading, todayTemp, todayWind, todayHumi);
}

//5-Day forecast
function forecastDate(day) {
  let forecastDate = moment().add(day, "d").format("YYYY-MM-DD");
  return forecastDate + " 12:00:00";
}

function renderFutureForecast(response) {
  let forecastHeading = $("<h4>").attr("class", "font-weight-bold");
  forecastHeading.text("5-Day Forecast:");
  let forecastDeck = $("<div>").attr("class", "card-deck");
  forecastDiv.append(forecastHeading, forecastDeck);

  let forecastList = response.list;
  let dayFlag = 1;

  for (let i = 1; i < forecastList.length; i++) {
    if (forecastDate(dayFlag) === forecastList[i].dt_txt) {
      fillForecastCard(forecastList[i]);
      dayFlag++;
    }
  }
}

function fillForecastCard(obj) {
  let forecastDeck = $(".card-deck");
  let forecastCard = $("<div>").attr("class", "bg-info text-white shadow card");
  let forecastCardBody = $("<div>").attr("class", "card-body");

  //temp conversion
  let kelToCel = obj.main.temp - 273.15;
  let celcius = Math.round(kelToCel * 10) / 10;

  //forecast heading
  let cardHeader = $("<div>").attr("class", "card-header");
  let futureDate = $("<h5>").attr("class", "text-center font-weight-bold");
  futureDate.text(moment(obj.dt_txt).format("DD/MM/YY"));
  //weather icon
  let icon = $("<img>");
  let fcIcon = obj.weather[0].icon;
  icon.attr({
    src: `http://openweathermap.org/img/wn/${fcIcon}@2x.png`,
    alt: `${obj.weather[0].description}`,
    class: "mx-auto d-block",
  });
  //temp
  let futureTemp = $("<p>");
  futureTemp.text(`Temp: ${celcius}°C`);
  //wind
  let futureWind = $("<p>");
  futureWind.text(`Wind: ${obj.wind.speed}KPH`);
  //humidity
  let futureHumi = $("<p>");
  futureHumi.text(`Humidity: ${obj.main.humidity}%`);

  forecastDeck.append(forecastCard);
  forecastCard.append(cardHeader, forecastCardBody);
  cardHeader.append(icon, futureDate);
  forecastCardBody.append(futureTemp, futureWind, futureHumi);
}

function renderCityButtons() {
  //empty ul to make sure that buttons do not duplicate
  cityHistory.empty();

  //create a button for every item in array
  for (i = 0; i < cityNames.length; i++) {
    let cityButton = $("<li>");
    cityButton.addClass("btn btn-outline-dark mb-1 city-btn");
    cityButton.attr("data-city", cityNames[i]);
    cityButton.text(cityNames[i]);
    cityHistory.append(cityButton);
  }
}

//Retrieve past searches when city button is pressed
function getPastForcast(event) {
  let city = $(event.target).attr("data-city");
  // alert("you clicked " + city); //test
  let apiKey = "&appid=690c3a6b7201e389fe103be085cb462f";
  let queryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}${apiKey}`;

  todayDiv.empty();
  forecastDiv.empty();
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    renderForecast(response);
    renderFutureForecast(response);
  });
}

//event listeners

searchBtn.on("click", findCity);
cityHistory.on("click", ".city-btn", getPastForcast);
