const apiKey = "7aa46ff16e9fcb4c5a44464b21457ec0";

const searchBtn =
    document.getElementById("search-btn");

const cityInput =
    document.getElementById("city-input");

const originalBtnText =
    searchBtn.textContent;

const historyList =
    document.getElementById("history-list");

const locationBtn =
    document.getElementById("location-btn");

searchBtn.addEventListener("click", () => {

    const city = cityInput.value;

    getWeather(city);

});

locationBtn.addEventListener("click", () => {

    navigator.geolocation.getCurrentPosition(
        successLocation,
        errorLocation
    );
});

cityInput.addEventListener("keypress", (event) => {

    if(event.key === "Enter") {

        getWeather(cityInput.value);
    }
});

async function getWeather(city) {

    const url =
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    /* LOADING START */

    searchBtn.textContent = "Loading...";

    searchBtn.disabled = true;

    try {

        const response = await fetch(url);

        const data = await response.json();

        console.log(data);

        if(data.cod === "404") {

            alert("City not found");

            return;
        }

        updateWeatherUI(data);
        
        saveSearch(city);

    }

    catch(error) {

        console.log(error);

        alert("Something went wrong");
    }

    finally {

        /* LOADING END */

        searchBtn.textContent =
            originalBtnText;

        searchBtn.disabled = false;
    }
}

/* SAVE SEARCH */

function saveSearch(city) {

    let searches =
        JSON.parse(
            localStorage.getItem("searches")
        ) || [];

    if(!searches.includes(city)) {

        searches.push(city);

        localStorage.setItem(
            "searches",
            JSON.stringify(searches)
        );

        renderHistory();
    }
}

/* RENDER HISTORY */

function renderHistory() {

    historyList.innerHTML = "";

    let searches =
        JSON.parse(
            localStorage.getItem("searches")
        ) || [];

    searches.forEach(city => {

        const li =
            document.createElement("li");

        li.textContent = city;

        li.addEventListener("click", () => {

            getWeather(city);
        });

        historyList.appendChild(li);
    });
}

/* LOAD HISTORY */

renderHistory();

/* SUCCESS LOCATION */

async function successLocation(position) {

    const lat =
        position.coords.latitude;

    const lon =
        position.coords.longitude;

    const url =
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {

        const response =
            await fetch(url);

        const data =
            await response.json();

        updateWeatherUI(data);

    }

    catch(error) {

        console.log(error);

        alert("Location weather failed");
    }
}

/* ERROR LOCATION */

function errorLocation() {

    alert("Location access denied");
}

function updateWeatherUI(data) {

    document.getElementById("city-name")
        .textContent = data.name;

    document.getElementById("temperature")
        .textContent =
            `${Math.round(data.main.temp)}°C`;

    document.getElementById("description")
        .textContent =
            data.weather[0].description;

    const weatherMain =
        data.weather[0].main.toLowerCase();

    document.body.className = "";

    if(weatherMain.includes("clear")) {

        document.body.classList.add("clear");
    }

    else if(weatherMain.includes("cloud")) {

        document.body.classList.add("clouds");
    }

    else if(weatherMain.includes("rain")) {

        document.body.classList.add("rain");
    }

    else if(weatherMain.includes("snow")) {

        document.body.classList.add("snow");
    }

    else if(weatherMain.includes("thunderstorm")) {

        document.body.classList.add("thunderstorm");
    }

    else {

        document.body.classList.add("clear");
    }

    const iconCode =
        data.weather[0].icon;

    const iconUrl =
`https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    document.getElementById("weather-icon")
        .src = iconUrl;

    document.getElementById("humidity")
        .textContent =
            `Humidity: ${data.main.humidity}%`;

    document.getElementById("wind")
        .textContent =
            `Wind: ${data.wind.speed} km/h`;
}