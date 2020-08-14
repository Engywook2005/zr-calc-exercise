import React from 'react';
import AnnualRateCalculator from '../../utils/annualRateCalculator';

const FormElements = {

  /**
   *
   * @param props
   * @returns {*}
   * @constructor
   */
  OutputColumn(props) {
    // @TODO color and background depending on user rate

    const { title } = props;
    const { baseAnnual } = props;
    const { carImpact } = props;
    const { total } = props;

    return (
      <div
        className="outputColumn"
      >
        <p><strong><u>{title}</u></strong></p>
        <p><strong>Base Annual</strong></p>
        <p>{baseAnnual}</p>
        <p><strong>Car Impact</strong></p>
        <p>{carImpact}</p>
        <p><strong>Total</strong></p>
        <p>{total}</p>
      </div>
    );
  },

  MileageSlider(props) {
    const { onchange } = props;
    const { milesPerYear } = props;

    return (
      <input
        type="range"
        min="0"
        max="100000"
        value={milesPerYear}
        onChange={(e) => {
          onchange(parseInt(e.target.value, 10), 'milesPerYear');
        }}
      />
    );
  },

  ChargeTimeDropdown(props) {
    // @TODO make charging duration settable.

    const { carChargingHours } = props;
    const { onchange } = props;
    const { start } = carChargingHours;

    const times = [...Array(24).keys()];

    const options = times.map((time, key) => (
      <option
        value={time}
        key={key}
      >
        {time}
        :00:00 to
        {' '}
        {AnnualRateCalculator.handleOvernightTime(time)}
        :00:00
      </option>
    ));

    return (
      <select
        value={start}
        onChange={(e) => {
          const startTime = parseInt(e.target.value, 10);
          const endTime = AnnualRateCalculator.handleOvernightTime(startTime);

          const newTimeRange = {
            start: startTime,
            end: endTime,
          };

          onchange(newTimeRange, 'carChargingHours');
        }}
      >
        {options}
      </select>
    );
  },
};

module.exports = FormElements;
