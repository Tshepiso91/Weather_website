// Import required modules
const https = require('https');
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve the index.html file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Route to handle form submission on index.html
app.post("/", function (req, res) {
  // Extract city name from the request body
  const query = req.body.cityName;
  const apiKey = "YOUR APIKEY";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  // Make a GET request to the OpenWeatherMap API
  https.get(url, function (response) {
    console.log(response.statusCode);

    // Handle the data received from the API
    let weatherData = "";

    response.on("data", function (data) {
      // Append the data received to weatherData
      weatherData += data;
    });

    response.on("end", function () {
      // Parse the weather data received into JSON format
      weatherData = JSON.parse(weatherData);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      // Create the weather information HTML
      const weatherInfo = `
        <div class="weather-info">
          <p>The weather is currently: ${weatherDescription}</p>
          <h1>The temperature in ${query} is: ${temp}<sup>o</sup> degrees Celsius<h1>
          <img src=${imageURL}>
        </div>
      `;

      // Modify the response to include only the weather information
      const indexHtml = `
        <!DOCTYPE html>
        <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8">
          <title>Weather App</title>
          <!-- Add your stylesheet link here -->
        </head>
        <body>
          ${weatherInfo}
        </body>
        </html>
      `;

      // Send the weather information as the response
      res.send(indexHtml);
    });
  });
});

// Route to handle form submission and redirect to home page
app.post("/weather", function (req, res) {
  res.redirect("/");
});

// Start the server on port 3000
app.listen(3000, function () {
  console.log("Server is running smoothly");
});
