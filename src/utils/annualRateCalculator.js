const AnnualRateCalc = {

  /**
   *
   * @param {*}     bpSet   Number or array. If a number, return an array of length 24
   *                        where all values are the same.
   *                        Otherwise, will need to return an array of length 24
   *                        with variable values.
   * @returns {[]}          Array of charges for each hour.
   */
  getRatesByHour(bpSet) {
    let timeArr = [];

    if (typeof bpSet === 'number') {
      // For a flat rate just return an array where all hours have the same charge.
      timeArr = Array(24).fill(bpSet);
    } else {
      // Otherwise, we need to plot out an array where there is a different charge for each
      // hour, using the breakpoints.
      const times = Object.keys(bpSet);

      for (let i = 0; i < times.length; i += 1) {
        const nextArrLength = i < times.length - 1
          // Will be adding a number of values equal to the number of hours before change in rate
          ? times[i + 1] - times[i]
          // Last rate of the day so fill the remaining hours.
          : 24 - timeArr.length;

        timeArr = timeArr.concat(Array(nextArrLength).fill(bpSet[times[i]]));
      }
    }

    return timeArr;
  },

  /**
   * Gets cost of charging car.
   *
   * @param {*}       bpSets              Number or array. If a number, return an array of length 24
   *                                      where all values are the same.
   *                                      Otherwise, will need to return an array of length 24
   *                                      with variable values.
   * @param {Object}  carChargingHours    Beginning and end times for charging vehicle.
   * @param {Number}  milesPerYear        Miles driven per year.
   * @returns {Object} Impact of car charging on flat and TOU plans.
   */
  getCarChargingCosts(bpSets, carChargingHours, milesPerYear) {
    // @TODO should not really be necessary to convert to daily...
    const dailyMileage = milesPerYear / 365;
    const bpSetKeys = Object.keys(bpSets);

    // @TODO make cost per mile user-settable.
    // Presuming 8 hours to charge a car, divide the kwh load by the number of
    // hours it takes to charge the car.
    // @TODO make charge duration also settable.
    const chargeTimeKWH = dailyMileage * (0.3 / 8);
    const carChargingCosts = {};

    let i; // Set of rates
    let j; // Times of day

    for (i = 0; i < bpSetKeys.length; i += 1) {
      const ratesByHour = AnnualRateCalc.getRatesByHour(bpSets[bpSetKeys[i]]);
      const startTime = carChargingHours.start;

      // Make it easier to iterate over hours.
      const endTime = carChargingHours.end < carChargingHours.start
        ? carChargingHours.end + 24
        : carChargingHours.end;

      let runningTotal = 0;

      for (j = startTime; j <= endTime; j += 1) {
        // Back to numbers that point to a value.
        const thisTime = j > 23
          ? j - 24
          : j;

        runningTotal += ratesByHour[thisTime] * chargeTimeKWH;
      }

      carChargingCosts[bpSetKeys[i]] = runningTotal * 365;
    }

    const returnedCarChargingCosts = this.ratesToFinancial(carChargingCosts);

    return returnedCarChargingCosts;
  },

  /**
   * Takes hourly rate plans and returns total charge over a year for these plans.
   *
   * @param {*}      bpSets       Number or data object. The scheme for hourly rates
   *                              If it's a number, it's a flat rate and the
   *                              rate will be the same each hour. If it's an object,
   *                              it's time of use so process breakpoints.
   * @param {Object} loadProfile  Broken down by hour, then by day. Record of kwh for each
   *                              hour and day of year.
   * @returns {{}}                Total charge for year under each plan entered through bpSets.
   */
  getRateFromProfile(bpSets, loadProfile) {
    const totalRates = {};
    const bpSetKeys = Object.keys(bpSets);

    let i; // Set of hourly rates
    let j; // Hours
    let k; // Days in year

    // i iterates over rate plans.
    for (i = 0; i < bpSetKeys.length; i += 1) {
      // Rates for each hour of the day.
      const ratesByHour = AnnualRateCalc.getRatesByHour(bpSets[bpSetKeys[i]]);

      // Initialize total rates for each rate type.
      totalRates[bpSetKeys[i]] = 0;

      // j iterates over hours.
      for (j = 0; j < 24; j += 1) {
        let targetHour = j + 1;
        targetHour = targetHour < 10
          ? `0${targetHour}:00:00`
          : `${targetHour}:00:00`;

        // i.e. Jan 1 - Dec 31 at the specific hour we are looking at.
        const targetProfileHour = loadProfile[targetHour];

        // k iterates over days for each hour.
        for (k = 0; k < targetProfileHour.length; k += 1) {
          totalRates[bpSetKeys[i]] += targetProfileHour[k].kwh * ratesByHour[j];
        }
      }
    }

    return AnnualRateCalc.ratesToFinancial(totalRates);
  },

  /**
   * Ensures that numbers are rounded to two decimal places.
   *
   * @param rates
   * @returns {{}}
   */
  ratesToFinancial(rates) {
    const keys = Object.keys(rates);
    const newRates = {};

    keys.forEach((key) => {
      const rawValue = rates[key];
      const roundedValue = parseFloat(rawValue.toFixed(2));

      newRates[key] = roundedValue;
    });

    return newRates;
  },

  /**
   * Gets end time accounting for possibility that end time is after midnight
   * but start time is before midnight.
   *
   * @param {Number} startTime
   * @returns {Number}
   */
  handleOvernightTime(startTime) {
    const endTime = (startTime + 8) < 24
      ? startTime + 8
      : (startTime + 8) - 24;
    return endTime;
  },

};

module.exports = AnnualRateCalc;
