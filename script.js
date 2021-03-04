let searchButton = document.querySelector(".btn");
let historyBlock = document.querySelector("#history-block");
let forecastContainer = document.getElementById("five-day");

// Global variable definitions for weather parameters
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

    // Defining a variable for the submitted text content
    userQueryPrev = document.getElementById("cityInput").value;

    // If statement to prevent duplicate search from cluttering history
    if (userQueryPrev != userQuery) {
        userQuery = userQueryPrev;

        // Creating element for search history bar and appending it
        let historyRow = document.createElement("button");
        historyRow.setAttribute("class", "history-row");
        historyRow.setAttribute("value", userQuery);
        historyRow.setAttribute("onclick", "historySearch(this.value)");

        historyRow.textContent = userQuery;
        historyBlock.appendChild(historyRow);

        // Calling function to fetch data using current query
        fetchCurrent(userQuery);
    }


    
    
}

// Function definition for passing value from search history to fetchCurrent()
function historySearch(value) {
    event.preventDefault();
    console.log(value);
    userQuery = value;
    fetchCurrent(value);
}

// Function definition for fetch call to the current weather API
function fetchCurrent (query) {
    console.log(query);
    
    let currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=ea6eca850366a93e521d5f44b68aab35";
    
    fetch(currentURL).then(function(response) {
        if (response.ok) {
            return response.json().then(function(data) {
                setCurrent(data);
            })  
        }
        else {
            throw Error(response.statusText);
        }
    })
}


// Function definition to grab relevant data from current weather API and store it in relevant variables
function setCurrent(data) {
    // event.preventDefault();
    cityName = data.name;
    weatherIcon = data.weather[0].icon;
    cityTemp = Math.round(((data.main.temp)-273.15)*9/5+32);
    cityHumid = data.main.humidity;
    cityWind = data.wind.speed;
    
    // Function call to fetchUVI() to grab UV Index data from that API
    fetchUVI(data);
}

// Function definition for fetchUVI() which calls the UVI API from openweathermap
function fetchUVI(data) {
    lattitude = data.coord.lat;
    longitude = data.coord.lon;
    let uvAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longitude + "&exclude=daily,hourly,minutely&appid=ea6eca850366a93e521d5f44b68aab35";

    fetch(uvAPI).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

                //Function call to setUVI()
                setUVI(data);
            })
        }
        else {
            throw Error(response.statusText);
        }
    })
}

// Function definition for setUVI() which stores the UV Index information in the relevant variable and passes it to the displayCurrent() function
function setUVI(data) {
    cityUVI = data.current.uvi;
    displayCurrent(data);
}

// Function definitin for displayCurrent() which takes all gathered information on current weather and displays it using DOM manipulation
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

    // Call to fetchFive() to fetch data from the 5-day forecast API passing the same user query along
    fetchFive(userQuery);

}

// Function definition for fetchFive() which fetches the relevant 5-day forecase data from the 5-day API using the original user query
function fetchFive(query) {
    console.log(query);
    let fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + query + "&appid=ea6eca850366a93e521d5f44b68aab35";

    console.log(fiveDayURL);

    fetch(fiveDayURL).then(function(response) {
        if (response.ok) {
            return response.json().then(function(data) {

                // Function call to displayFive() passing along the API data
                displayFive(data);
            })
        }
        else {
            throw Error(response.statusText);
        }
    })
    
}

// Function definition for displayFive() which formats and displays the 5-day forecast using DOM manipulation
function displayFive(data) {

    // Clear any previous five-day forecast renderings
    forecastContainer.innerHTML = "";
    
    // For loop using the relevant index values found within the API to gather data for each day at 12:00PM (2,10,18,26,34)
    for (let i = 2; i <= 34; i = i + 8) {
        let dayDivEl = document.createElement("div");
        dayDivEl.setAttribute("class", "five-day");
        forecastContainer.appendChild(dayDivEl);

        let dayDate = data.list[i].dt_txt;
        let year = dayDate.slice(0,4);
        let month = "";
        let day = "";

        // These if statements check to see if the value of the first digit of the day and month is a 0 and will leave the 0 out if so
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
        
        let dateEl = document.createElement("h3");
        dateEl.textContent = formDate;
        dayDivEl.appendChild(dateEl);

        let fiveIcon = data.list[i].weather[0].icon;
        let iconEl = document.createElement("i");
        let iconURL = "https://openweathermap.org/img/w/" + fiveIcon + ".png";
        iconEl.innerHTML = "<img src='" + iconURL  + "'>";
        dayDivEl.appendChild(iconEl);

        let tempEl = document.createElement("h4");
        let formTemp = Math.round(((data.list[i].main.temp)-273.15)*9/5+32);
        tempEl.textContent = "Temperature: " + formTemp + "\xB0F";
        dayDivEl.appendChild(tempEl);

        let humidEl = document.createElement("h4");
        humidEl.textContent = "Humidity: " + data.list[i].main.humidity + "%";
        dayDivEl.appendChild(humidEl);

    }
}


// Event listener for main search button
searchButton.addEventListener("click", getCityName);


