let searchButton = document.querySelector(".btn");
let historyBlock = document.querySelector("#history-block");
let currDate = moment().format('L');
let cityName = "";
let weatherIcon = "";
let cityTemp = "";
let cityHumid = "";
let cityWind = "";
let lattitude = "";
let longitude = "";
let cityUVI = "";
let userQuery = "";

// Function to handle user-inputted city name
function getCityName (event) {
    // Prevents page from refreshing upon submit
    event.preventDefault();

    // Defining a variable for the submitted text content and appending it to the search history div
    userQuery = document.getElementById("cityInput").value;
    let historyRow = document.createElement("button");
    historyRow.setAttribute("class", "history-row");
    historyRow.setAttribute("value", userQuery);
    historyRow.setAttribute("onclick", "historySearch(this.value)");

    historyRow.textContent = userQuery;
    historyBlock.appendChild(historyRow);

    fetchCurrent(userQuery);
}

function historySearch(value) {
    event.preventDefault();
    console.log(value);
    fetchCurrent(value);
}

function fetchCurrent (query) {
    let currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=ea6eca850366a93e521d5f44b68aab35";

    fetch(currentURL).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                setCurrent(data);
            })  
        }
        else {
            document.location.replace("index.html");
        }
    })
}



function setCurrent(data) {
    console.log(data);
    cityName = data.name;
    weatherIcon = data.weather[0].icon;
    cityTemp = Math.round(((data.main.temp)-273.15)*9/5+32);
    cityHumid = data.main.humidity;
    cityWind = data.wind.speed;
    
    fetchUVI(data);
}

function fetchUVI(data) {
    lattitude = data.coord.lat;
    longitude = data.coord.lon;
    let uvAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longitude + "&exclude=daily,hourly,minutely&appid=ea6eca850366a93e521d5f44b68aab35";

    fetch(uvAPI).then(function(response) {
        if (response.ok) {
            return response.json().then(function(data) {
                setUVI(data);
            })
        }
        else {
            document.location.replace("index.html");
        }
    })
}

function setUVI(data) {
    cityUVI = data.current.uvi;
    displayCurrent(data);
}

function displayCurrent(data) {
    // Create elements for main weather display and append data to create the main display
    let containerEl = document.querySelector("#display-current");
    containerEl.innerHTML = "";

    let headerEl = document.createElement("h2");
    headerEl.textContent = cityName;
    containerEl.appendChild(headerEl);

    let dateEl = document.createElement("span");
    dateEl.textContent = " (" + currDate +")";
    headerEl.appendChild(dateEl);

    let iconEl = document.createElement("i");
    let iconURL = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
    iconEl.innerHTML = "<img src='" + iconURL  + "'>";
    headerEl.appendChild(iconEl);

    let pEl = document.createElement("p");
    containerEl.appendChild(pEl);

    temperatureEl = document.createElement("h4");
    temperatureEl.textContent = "Temperature: " + cityTemp + "\xB0F";
    pEl.appendChild(temperatureEl);

    humidityEl = document.createElement("h4");
    humidityEl.textContent = "Humidity: " + cityHumid + "%";
    pEl.appendChild(humidityEl);

    windEl = document.createElement("h4");
    windEl.textContent = "Wind Speed: " + cityWind + " MPH";
    pEl.appendChild(windEl);

    uviEl = document.createElement("h4");
    uviEl.textContent = "UV Index: " + cityUVI;
    pEl.appendChild(uviEl);

    fetchFive(userQuery);

}

function fetchFive(query) {
    let fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=ea6eca850366a93e521d5f44b68aab35";

    console.log(fiveDayURL);

    fetch(fiveDayURL).then(function(response) {
        if (response.ok) {
            return response.json().then(function(data) {
                displayFive(data);
            })
        }
        else {
            document.location.replace("index.html");
        }
    })
    
}

function displayFive(data) {
    console.log(data);
    let forecastContainer = document.getElementById("five-day");
    for (let i = 2; i <= 34; i = i + 8) {
        let dayDivEl = document.createElement("div");
        forecastContainer.appendChild(dayDivEl);

        let dayDate = data.list[i].dt_txt;
        let year = dayDate.slice(0,4);
        let month = "";
        let day = "";

        if (dayDate.charAt(5) != 0) {
            month = dayDate.slice(5,7);
        }
        else {
            month = dayDate.slice(6,7); 
        }
        if (dayDate.charAt(8) != 0) {
            day = dayDate.slice(8,10);
        }
        else {
            day = dayDate.slice(9,10);
        }
        
        let formDate = month + "/" + day + "/" + year;
        
        let dateEl = document.createElement("h4");
        dateEl.textContent = formDate;
        dayDivEl.appendChild(dateEl);

        let fiveIcon = data.list[i].weather[0].icon;
        let iconEl = document.createElement("i");
        let iconURL = "https://openweathermap.org/img/w/" + fiveIcon + ".png";
        iconEl.innerHTML = "<img src='" + iconURL  + "'>";
        dayDivEl.appendChild(iconEl);











        // for (let i = 2; i < 34; i = i + 8) {

        // }
    }
}



searchButton.addEventListener("click", getCityName);


// api.openweathermap.org/data/2.5/forecast?q={city name}&appid=ea6eca850366a93e521d5f44b68aab35
