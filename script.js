document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.getElementById("city-input");
  const getWeatherBtn = document.getElementById("get-weather-btn");
  const weatherInfo = document.getElementById("weather-info");
  const cityNameDisplay = document.getElementById("city-name");
  const temperatureDisplay = document.getElementById("temperature");
  const descriptionDisplay = document.getElementById("description");
  const AQIDisplay = document.getElementById("AQI");
  const errorMessage = document.getElementById("error-message");

  const API_KEY = "34314eea8a7a317d576958f064915daa";  

  getWeatherBtn.addEventListener("click",  async ()=>{
    const city=cityInput.value.trim()  //it will take name as input than remove all the extra spaces
    if(!city) return;  //if there is no city than it will return.....

    //it may throw an error
    // server/database is always in another continent

    try {
        const weatherData=await fetchWeatherData(city)
         const { coord } = weatherData; // Extract coordinates for AQI call
         const AQIData = await fetchAQIData(coord.lat, coord.lon);
        displayWeatheData(weatherData,AQIData);
    } catch (error) {
        showError();
    }

});

async function fetchWeatherData(city)
{
        //gets the data

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

        const response = await fetch(url);
        console.log(typeof response);
        console.log("RESPONSE" , response);

        if(!response.ok){
            throw new Error("City Not Found");
        }
       const data =  await response.json()
       return data;
    }
    async function fetchAQIData(lat, lon) {
      const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("AQI Data Not Found");
      }
      return response.json();
    }

function displayWeatheData(data,AQIData)
{
        console.log(data);
        const {name,main,weather}=data;
         const aqi = AQIData.list[0].main.aqi;
        cityNameDisplay.textContent=name;
        temperatureDisplay.textContent= `Temperature:${main.temp}`;
        descriptionDisplay.textContent=`Weather:${weather[0].description}`;
        AQIDisplay.textContent = `AQI: ${aqi}(${getAQIDescription(aqi)})`;

        //unlock the display
        weatherInfo.classList.remove("hidden");
        errorMessage.classList.add("hidden");
}

    function showError(){
        weatherInfo.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
     function getAQIDescription(aqi) {
       const descriptions = [
         "Good (0-50)",
         "Fair (51-100)",
         "Moderate (101-150)",
         "Poor (151-200)",
         "Very Poor (201+)",
       ];
       return descriptions[aqi - 1] || "Unknown";
     }
});
