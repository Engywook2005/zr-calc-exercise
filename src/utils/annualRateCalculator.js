const RateCalc = {

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

    if (!Array.isArray(bpSet)) {
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
          : 24 - times[i];

        timeArr = timeArr.concat(timeArr, Array(nextArrLength).fill(bpSet[times[i]]));
      }
    }

    return timeArr;
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

    let i;
    let j;
    let k;

    // i iterates over rate plans.
    for (i = 0; i < bpSetKeys.length; i += 1) {
      // Rates for each hour of the day.
      const ratesByHour = RateCalc.getRatesByHour(bpSets[bpSetKeys[i]]);

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
          totalRates[bpSetKeys[i]] += targetProfileHour[k] * ratesByHour[j];
        }
      }
    }

    return totalRates;
  },
};

module.exports = RateCalc;
