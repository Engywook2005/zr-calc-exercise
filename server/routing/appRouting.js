const fs = require('fs');

class AppRouting {
  constructor(app) {
    this.app = app;
    this.loadProfile = {};
  }

  init() {
    this.prepLoadProfile();
  }

  /**
   * Called once when server starts. In a real use case this would more likely be based on
   * something more fluid than a static file, e.g. a database; so we would be getting that ready.
   */
  prepLoadProfile() {
    // loadProfile.json created by running yarn run loadProfile.
    fs.readFile('./sourceData/loadProfile.json', 'utf8', (err, data) => {
      if (err) {
        // @TODO handle
      } else {
        const loadProfileFromSourceData = JSON.parse(data);
        const outputLoadProfile = {};

        loadProfileFromSourceData.forEach((loadDateHour) => {
          const dateTimeArray = loadDateHour['Date/Time'].split('  ');
          const date = dateTimeArray[0].trim();
          const hour = dateTimeArray[1];

          // @TODO likely to make more sense to pull the time out and create an array
          // length 365 for each time of day.
          const newObj = {
            date,
            kwh: loadDateHour['Electricity:Facility [kWh](Hourly)'],
          };

          if (!outputLoadProfile[hour]) {
            outputLoadProfile[hour] = [];
          }

          // @ TODO need to also break out by month?

          outputLoadProfile[hour].push(newObj);
        });

        this.loadProfile = outputLoadProfile;

        this.app.get('/data/loadProfile', (request, response) => {
          response.send(JSON.stringify(this.loadProfile));
        });
      }
    });
  }
}

module.exports = AppRouting;
