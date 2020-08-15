import React from 'react';
import AnnualRateCalculator from '../../utils/annualRateCalculator';

const FormElements = {

  OutputColumn(props) {
    // @TODO color and background depending on user rate

    const { title } = props;
    const { rateType } = props;
    const { userRate } = props;
    const { baseAnnual } = props;
    const { carImpact } = props;
    const { total } = props;

    return (
      <div
        className="outputColumn"
      >
        <p><strong><u>{title}</u></strong></p>
        <p>
          <strong>Base Annual</strong>
          :
          {' '}
          {baseAnnual}
        </p>
        <p>
          <strong>Car Impact</strong>
          :
          {' '}
          {carImpact}
        </p>
        <p>
          <strong>Total</strong>
          :
          {' '}
          {total}
        </p>
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

  UserRateRadioButtons(props) {
    const { userRate } = props;
    const { onchange } = props;
    const { title } = props;
    const { buttonVal } = props;

    return (
      <span>
        <input
          type="radio"
          value={buttonVal}
          checked={userRate === buttonVal}
          onChange={onchange}
        />
        &nbsp;
        {title}
      </span>
    );
  },
};

module.exports = FormElements;
