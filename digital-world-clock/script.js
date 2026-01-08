// State Management
let is24Hour = false;
let currentIanaTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let currentLocationLabel = "Local Time";
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

const timeEl = document.getElementById('timeValue');
const dateEl = document.getElementById('dateValue');
const locationEl = document.getElementById('locationName');
const formatBtn = document.getElementById('formatToggle');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const recentList = document.getElementById('recentList');

// Initialize
function init() {
    updateClock();
    renderRecentSearches();
    setInterval(updateClock, 1000); // Core requirement: Update every second
}

// Function to format and display time
function updateClock() {
    const now = new Date();
    
    // Formatting options based on state
    const timeOptions = {
        timeZone: currentIanaTimeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24Hour
    };

    const dateOptions = {
        timeZone: currentIanaTimeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    timeEl.textContent = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
    dateEl.textContent = new Intl.DateTimeFormat('en-US', dateOptions).format(now);
    locationEl.textContent = currentLocationLabel;
}

// Search Logic: Uses Geocoding API to find timezone
async function searchLocation() {
    const query = cityInput.value.trim();
    if (!query) return;

    try {
        // Fetch location data from Open-Meteo (Free, no API key needed)
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            alert("Location not found. Please try another city.");
            return;
        }

        const result = data.results[0];
        currentIanaTimeZone = result.timezone;
        currentLocationLabel = `${result.name}, ${result.country}`;
        
        saveToRecent(currentLocationLabel, currentIanaTimeZone);
        updateClock();
        cityInput.value = "";
    } catch (error) {
        console.error("Search error:", error);
        alert("Error connecting to the time service.");
    }
}

// LocalStorage Logic
function saveToRecent(label, tz) {
    const entry = { label, tz };
    // Filter out duplicates
    recentSearches = recentSearches.filter(item => item.label !== label);
    recentSearches.unshift(entry);
    recentSearches = recentSearches.slice(0, 6); // Keep last 6
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    renderRecentSearches();
}

function renderRecentSearches() {
    recentList.innerHTML = "";
    recentSearches.forEach(item => {
        const card = document.createElement('div');
        card.className = 'recent-card';
        card.innerHTML = `
            <strong>${item.label}</strong>
            <p style="font-size: 0.8rem; color: #94a3b8">${item.tz}</p>
        `;
        card.onclick = () => {
            currentIanaTimeZone = item.tz;
            currentLocationLabel = item.label;
            updateClock();
        };
        recentList.appendChild(card);
    });
}

// Event Listeners
formatBtn.addEventListener('click', () => {
    is24Hour = !is24Hour;
    formatBtn.textContent = is24Hour ? "Switch to 12h" : "Switch to 24h";
    updateClock();
});

searchBtn.addEventListener('click', searchLocation);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchLocation();
});

init();