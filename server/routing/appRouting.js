const fs = require('fs');

class AppRouting {
  constructor(app) {
    this.app = app;
    this.loadProfile = [];
  }

  init() {
    console.log(this.app);

    this.prepLoadProfile();

    this.app.get('/data/loadProfile', (request, response) => {
      response.send(JSON.stringify(this.loadProfile));
    });
  }

  /**
   * Called once when server starts. In a real use case this would more likely be based on
   * something more fluid than a static file, e.g. a database; so we would be getting that ready.
   */
  prepLoadProfile() {
    // @TODO

    // loadProfile created by running yarn run loadProfile.
    fs.readFile('./sourceData/loadProfile.json', 'utf8', (err, data) => {
      if (err) {
        // @TODO handle
      } else {
        const loadProfile = JSON.parse(data);

        loadProfile.forEach((loadDateHour) => {
          const dateTimeArray = loadDateHour['Date/Time'].split('  ');

          // @TODO likely to make more sense to pull the time out and create an array
          // length 365 for each time of day.
          const newObj = {
            date: dateTimeArray[0].replace(' ', ''),
            hour: dateTimeArray[1],
            kwh: loadDateHour['Electricity:Facility [kWh](Hourly)'],
          };

          this.loadProfile.push(newObj);
        });
      }
    });
  }
}

module.exports = AppRouting;
