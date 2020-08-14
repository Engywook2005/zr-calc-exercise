import React from 'react';

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
};

module.exports = FormElements;
