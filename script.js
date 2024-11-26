window.addEventListener('load', () => {
    let lat, long;

    // Check if geolocation is available
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                lat = position.coords.latitude;
                long = position.coords.longitude;

                console.log(`Latitude: ${lat}, Longitude: ${long}`);

                const apiKey = 'YAaFm6hdyrRFyrEG6jiu5AwhhCLiRd70';
                const geopositionUrl = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apiKey}&q=${lat},${long}`;

                // Fetch data using Axios
                axios.get(geopositionUrl)
                    .then((response) => {
                        const data = response.data;

                        // Extract required details and store in an object
                        const locationDetails = {
                            country: data.Country?.LocalizedName || "Unknown Country",
                            locationKey: data.Key || "Unknown Location Key",
                            timezone: data.TimeZone?.Name || "Unknown Timezone",
                            locationTime: data.TimeZone?.NextOffsetChange || "Unknown Location Time"
                        };

                        // Display the location details on the page
                        updateLocationUI(locationDetails);

                        // Call getWeatherData to fetch weather information
                        getWeatherData(apiKey, locationDetails.locationKey);
                    })
                    .catch((error) => {
                        console.error("Error fetching geoposition data:", error);
                    });
            },
            (error) => {
                console.error("Error getting location:", error);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
});

// Function to fetch weather data
function getWeatherData(apiKey, locationKey) {
    const weatherUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apiKey}`;

    console.log(`Fetching weather data from: ${weatherUrl}`);

    // Fetch weather information using Axios
    axios.get(weatherUrl)
        .then((response) => {
            const weatherInfo = response.data;

            // Extract the weather details
            const headline = weatherInfo.Headline?.Text || "No headline available";
            const minTemp = weatherInfo.DailyForecasts[0]?.Temperature.Minimum?.Value || "N/A";
            const maxTemp = weatherInfo.DailyForecasts[0]?.Temperature.Maximum?.Value || "N/A";
            const date = weatherInfo.DailyForecasts[0]?.Date || "No date available";
            const dayTemp = weatherInfo.DailyForecasts[0]?.Temperature?.Maximum?.Value || "N/A";
            const nightTemp = weatherInfo.DailyForecasts[0]?.Temperature?.Minimum?.Value || "N/A";
            const dayPart = weatherInfo.DailyForecasts[0]?.Day?.IconPhrase || "No description available";
            const nightPart = weatherInfo.DailyForecasts[0]?.Night?.IconPhrase || "No description available";

            // Update the weather details on the page
            updateWeatherUI({headline, minTemp, maxTemp, date, dayTemp, nightTemp, dayPart, nightPart});
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
        });
}

// Function to update location details dynamically
function updateLocationUI(locationDetails) {
    document.getElementById("country").textContent = locationDetails.country;
    document.getElementById("location-key").textContent = locationDetails.locationKey;
    document.getElementById("timezone").textContent = locationDetails.timezone;
    document.getElementById("location-time").textContent = new Date(locationDetails.locationTime).toLocaleString();
}

// Function to update weather details dynamically
function updateWeatherUI({headline, minTemp, maxTemp, date, dayTemp, nightTemp, dayPart, nightPart}) {
    document.getElementById("headline").textContent = headline;
    document.getElementById("date").textContent = new Date(date).toLocaleDateString();
    document.getElementById("day-temp").textContent = dayTemp;
    document.getElementById("night-temp").textContent = nightTemp;
    document.getElementById("day-part").textContent = dayPart;
    document.getElementById("night-part").textContent = nightPart;
    document.getElementById("min-temp").textContent = minTemp;
    document.getElementById("max-temp").textContent = maxTemp;
}
