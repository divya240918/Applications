const API_KEY = "7016585d7305b65d3501aa7c4f7f3b78";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// DOM elements
const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const tempEl = document.querySelector(".temp");
const cityEl = document.querySelector(".city");
const humidityEl = document.querySelector(".humidity");
const windEl = document.querySelector(".wind");

// Fetch weather data
async function getWeather(city) {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();
    updateUI(data);
  } catch (error) {
    alert(error.message);
  }
}

// Update UI
function updateUI(data) {
  tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  cityEl.textContent = data.name;
  humidityEl.textContent = `${data.main.humidity}%`;
  windEl.textContent = `${data.wind.speed} km/hr`;

  const condition = data.weather[0].main.toLowerCase();

  if (condition.includes("cloud")) {
    weatherIcon.src = "clouds.png";
  } else if (condition.includes("rain")) {
    weatherIcon.src = "rain.png";
  } else if (condition.includes("clear")) {
    weatherIcon.src = "clear.png";
  } else if (condition.includes("snow")) {
    weatherIcon.src = "snow.png";
  } else {
    weatherIcon.src = "mist.png";
  }
}

// Button click
searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city !== "") {
    getWeather(city);
    searchInput.value = "";
  }
});

// Enter key support
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Default city on load (optional)
getWeather("Kolkata");
