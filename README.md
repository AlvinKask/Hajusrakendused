# Hajusrakendused

- no-framework js
- https://github.com/timotr/harjutused

- js xmlhttprequest
- https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  
- var asemel kasutada let ja const

```
const apiUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.4714921&lon=24.5734362';

const headers = {
  'User-Agent': 'Tallinna ilmaennustus',
};

fetch(apiUrl, {
  method: 'GET',
  headers: headers,
})
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Iterate through the "timeseries" array
    data.properties.timeseries.forEach(entry => {
      // Extract the "time" and "air_temperature" data from each entry
      const time = entry.time;
      const airTemperature = entry.data.instant.details.air_temperature;

      // Print out the time and air_temperature
      console.log(`Time: ${time}`);
      console.log(`Air Temperature: ${airTemperature} °C`);
    });
  })
  .catch(error => {
    console.error('Fetch Error:', error);
  });
```
