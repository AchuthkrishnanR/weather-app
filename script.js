const apiKey = "7aa46ff16e9fcb4c5a44464b21457ec0";

const searchBtn =
    document.getElementById("search-btn");

const cityInput =
    document.getElementById("city-input");

const originalBtnText =
    searchBtn.textContent;

searchBtn.addEventListener("click", () => {

    const city = cityInput.value;

    getWeather(city);

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

        document.getElementById("city-name")
            .textContent = data.name;

        document.getElementById("temperature")
            .textContent =
                `${Math.round(data.main.temp)}°C`;

        document.getElementById("description")
            .textContent =
                data.weather[0].description;

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