import React from 'react';
import FormElements from './formelements';

/**
 * All of the forms that are in the calculator come from here.
 */
const Forms = {

  /**
   * Returns form element container
   *
   * @param {HTMLElement}   innerEl   Element containing the form proper.
   * @param {Object}        props     Used for positioning and other kinds of styling.
   * @returns {HTMLElement}
   */
  BasicForm(innerEl, props) {
    const { style } = props || {};

    return (
      <div
        className="calcPanel"
        style={style}
      >
        { innerEl }
      </div>
    );
  },

  /**
   * Using flat rate or TOU
   *
   * @param   {Object}          props   Data passed down from top level component.
   * @returns {HTMLElement}
   */
  WhichRate(props) {
    const { userRate } = props;
    const { onchange } = props;

    const handleChange = (e) => {
      onchange(e.target.value, 'userRate');
    };

    return (Forms.BasicForm(
      <div>
        <p className="panelTitle">Current billing plan</p>
        <p>
          <FormElements.UserRateRadioButtons
            userRate={userRate}
            onchange={handleChange}
            buttonVal="flat"
            title="Flat"
          />
          &nbsp;
          &nbsp;
          &nbsp;
          <FormElements.UserRateRadioButtons
            userRate={userRate}
            onchange={handleChange}
            buttonVal="tou"
            title="TOU"
          />
        </p>
      </div>,
    ));
  },

  /**
   * Miles driven per year.
   *
   * @param   {Object}          props   Data passed down from top level component.
   * @returns {HTMLElement}
   */
  MilesPerYear(props) {
    const { milesPerYear } = props;
    const { onchange } = props;

    return (Forms.BasicForm(
      <div>
        <p className="panelTitle">Miles driven per year</p>
        <FormElements.MileageSlider
          milesPerYear={milesPerYear}
          onchange={onchange}
        />
        {' '}
        {milesPerYear}
      </div>,
    ));
  },

  /**
   * Charging hours.
   *
   * @param   {Object}          props   Data passed down from top level component.
   * @returns {HTMLElement}
   */
  ChargingHours(props) {
    const { onchange } = props;
    const { carChargingHours } = props;

    return (Forms.BasicForm(
      <div>
        <p className="panelTitle">Charging hours</p>
        <FormElements.ChargeTimeDropdown
          onchange={onchange}
          carChargingHours={carChargingHours}
        />
      </div>,
    ));
  },

  /**
   * Output, consisting of:
   *  Flat rate no car
   *  TOU rate no car
   *  Electric car impact, flat
   *  Electric car impact, tou
   *  Flat rate with car
   *  TOU rate with car
   *
   * @param   {Object}          props   Data passed down from top level component.
   * @returns {HTMLElement}
   */
  Output(props) {
    const clearLeftStyle = { clear: 'left', textAlign: 'left' };

    const savings = parseFloat((props.totalFlat - props.totalTOU).toFixed(2));
    let bestPlan = 'none';

    if (savings > 0) {
      bestPlan = 'tou';
    } else if (savings < 0) {
      bestPlan = 'flat';
    }

    const isOnBestPlan = props.userRate === bestPlan;

    let recommendation = `You ${isOnBestPlan ? 'are saving' : 'could save'} 
      ${Math.abs(savings)} per year 
      ${isOnBestPlan ? 'by staying on' : 'by switching to'} a
      ${bestPlan === 'tou' ? 'Time of Use' : 'Flat Rate'} plan.       
      `;

    if (bestPlan === 'none') {
      recommendation = 'Well it turns out that either plan will cost you just as much.';
    }

    return (Forms.BasicForm(
      <div>
        <p className="panelTitle">Compare Rates</p>
        <div>
          <FormElements.OutputColumn
            title="Flat rate"
            rateType="flat"
            userRate={props.userRate}
            baseAnnual={props.annualFlat}
            carImpact={props.carImpactAnnualFlat}
            total={props.totalFlat}
          />
          <FormElements.OutputColumn
            title="TOU"
            rateType="tou"
            userRate={props.userRate}
            baseAnnual={props.annualTOU}
            carImpact={props.carImpactAnnualTOU}
            total={props.totalTOU}
          />
        </div>
        <p style={clearLeftStyle}>{recommendation}</p>
      </div>,
      {
        style: {
          minWidth: '400px',
          position: 'absolute',
          top: '0px',
          left: '222px',
          height: '320px',
        },
      },
    ));
  },
};

module.exports = Forms;
