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
#
```
const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

// Create an array for the new column headers
const headers = [
  'Tootekood',
  'Kirjeldus',
  'Column 3',
  'Column 4',
  'Column 5',
  'Colum 6',
  'Column 7',
  'Column 8',
  'Hind km(ta)',
  'Column10',
  'Hind km(ga)',
];

// Read the content of 'LE.txt' and store it in a variable
let fileContents = fs.readFileSync('LE.txt', 'utf8');

// Split the existing data into rows
const rows = fileContents.trim().split('\n');

// Function to remove double quotes from the beginning and end of a string
function removeQuotes(str) {
  return str.replace(/^"/, '').replace(/"$/, '');
}

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  
  // Get the search query from the request URL
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const searchQuery = urlParams.get('search') || '';

  // Create an HTML form for searching
  const searchFormHtml = `
    <form>
      <input type="text" name="search" placeholder="Search..." value="${searchQuery}">
      <input type="submit" value="Search">
    </form>
  `;

  // Create an HTML table with headers and data
  let tableHtml = `<h2>Search Data</h2>${searchFormHtml}<table><tr>`;

  // Add header cells
  headers.forEach(header => {
    tableHtml += `<th>${header}</th>`;
  });

  tableHtml += '</tr>';

  // Filter and add data rows based on the search query
  rows.forEach(row => {
    const cells = row.split('\t');
    const tootekood = removeQuotes(cells[0]);
    const kirjeldus = removeQuotes(cells[1]);

    // Check if either 'Tootekood' or 'Kirjeldus' contains the search query
    if (tootekood.includes(searchQuery) || kirjeldus.includes(searchQuery)) {
      tableHtml += '<tr>';
      cells.forEach(cell => {
        const cellWithoutQuotes = removeQuotes(cell);
        tableHtml += `<td>${cellWithoutQuotes}</td>`;
      });
      tableHtml += '</tr>';
    }
  });

  tableHtml += '</table>';

  // Send the HTML table as the response
  res.end(tableHtml);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```
- [Varuosad.zip](https://github.com/AlvinKask/Hajusrakendused/files/12817286/Varuosad.zip)
