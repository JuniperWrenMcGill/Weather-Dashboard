document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '520197f2857cb9d20a057fcf3cd68930'; //API key
    const form = document.getElementById('city-search-form');
    const cityInput = document.getElementById('city-input');
    const weatherDetails = document.getElementById('weather-details');
    const forecastContainer = document.getElementById('forecast-container');
    const historyList = document.getElementById('history-list');
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Fetch current weather by city name
    async function fetchWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Weather data not found');
            const data = await response.json();
            displayCurrentWeather(data);
            // Use city ID from the current weather data to fetch forecast
            fetchForecastByID(data.id);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    }

    // Fetch 5-day forecast by city ID
    async function fetchForecastByID(cityID) {
        const forecastURL = `http://api.openweathermap.org/data/2.5/forecast?id=${cityID}&appid=${apiKey}&units=imperial`;
        try {
            const response = await fetch(forecastURL);
            if (!response.ok) throw new Error('Forecast data not found');
            const forecastData = await response.json();
            displayForecast(forecastData.list);
        } catch (error) {
            console.error("Error fetching forecast data:", error);
        }
    }

    // Display current weather
    function displayCurrentWeather(data) {
        weatherDetails.innerHTML = `
            <h3>${data.name}</h3>
            <p>Temperature: ${data.main.temp}°F</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} mph</p>
        `;
    }

    // Display forecast
    function displayForecast(forecastList) {
        forecastContainer.innerHTML = forecastList.filter((item, index) => index % 8 === 0) // Assuming 8 data points per day
            .map(day => `
                <div class="forecast-day">
                    <h4>${new Date(day.dt * 1000).toLocaleDateString()}</h4>
                    <p>Temp: ${day.main.temp}°F</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                </div>
            `).join('');
    }

    // Update and display search history
    function updateSearchHistory(city) {
        if (!searchHistory.includes(city)) {
            searchHistory = [city, ...searchHistory.slice(0, 4)];
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            displaySearchHistory();
        }
    }

    function displaySearchHistory() {
        historyList.innerHTML = searchHistory.map(city => `<li onclick="fetchWeather('${city}')">${city}</li>`).join('');
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            fetchWeather(city);
            updateSearchHistory(city);
            cityInput.value = ''; // Clear input field after search
        }
    });

    // Initialize
    displaySearchHistory();
});
