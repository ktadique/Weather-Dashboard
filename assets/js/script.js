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
    //render main forecast
    renderForecast(response);
    //render 5-day forecast
    renderFutureForecast(response);
  });

  //If input is empty or has already been searched throw error
  if (city === "") {
    alert("Please enter a city name");
  } else if (cityName.includes(city)) {
    alert("Please enter a new city name");
  } else {
    //generate button into city history
    renderCityButtons();
  }
}
//Main city forecast
function renderForecast(response) {
  let currentForecast = response.list[0];
  //create main forecast elements
  let todayCard = $("<div>").attr("class", "card");
  let todayCardBody = $("<div>").attr("class", "card-body");

  //main forecast information
  //heading
  let cityHeading = $("<h4>").attr("class", "font-weight-bold");
  cityHeading.text(`${response.city.name}  (${currentDay})`);
  //temp
  let kelToCel = currentForecast.main.temp - 273.15;
  let celcius = Math.round(kelToCel * 10) / 10;
  let todayTemp = $("<p>");
  todayTemp.text(`Temp: ${celcius}°C`);
  //weather icon
  let icon = $("<img>");
  let fcIcon = currentForecast.weather[0].icon;
  icon.attr(
    { src: `http://openweathermap.org/img/wn/${fcIcon}@2x.png` },
    { alt: `${currentForecast.weather[0].description}` },
    { width: "50" },
    { height: "50" }
  );
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

function renderFutureForecast(response) {
  let forecastHeading = $("<h4>").attr("class", "font-weight-bold");
  forecastHeading.text("5-Day Forecast:");
  let forecastDeck = $("<div>").attr("class", "card-deck");
  forecastDiv.append(forecastHeading, forecastDeck);

  /*   let forecastList = response.list;
  //filter next 5 days
  let forecastListDates = `${moment()
    .add(i + 1, "d")
    .format("YYYY-MM-DD")} 12:00:00`;

  //filter through response to retrieve a certain time - using midday to test
  let filteredDates = forecastList.filter(function midDay(list) {
    return list.dt_txt === forecastListDates;
  });
  console.log(filteredDates[0]); */

  for (let i = 0; i < 5; i++) {
    let forecastCard = $("<div>").attr("class", "card");
    let forecastCardBody = $("<div>").attr("class", "card-body");

    //forecast card information
    let forecastDate = moment()
      .add(i + 1, "d")
      .format("DD/MM/YY");
    let futureDate = $("<h5>");
    futureDate.text(forecastDate);
    let futureTemp = $("<p>");
    futureTemp.text(`Temp: `);
    let futureWind = $("<p>");
    futureWind.text(`Wind: `);
    let futureHumi = $("<p>");
    futureHumi.text(`Humidity: `);

    //append info to cards, cards to forecast deck
    forecastDeck.append(forecastCard);
    forecastCard.append(forecastCardBody);
    forecastCardBody.append(futureDate, futureTemp, futureWind, futureHumi);
  }
}

function renderCityButtons() {
  let input = $("#search-input").val();
  //push input into cityName array
  cityName.push(input);

  //empty ul to make sure that buttons do not duplicate
  cityHistory.empty();

  //create a button for every item in array
  for (i = 0; i < cityName.length; i++) {
    let cityButton = $("<li>");
    cityButton.addClass("btn btn-outline-dark mb-1 city-btn");
    cityButton.attr("data-city", cityName[i]);
    cityButton.text(cityName[i]);
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
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    renderForecast(response);
    futureForecast(response);
  });
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
