import React from 'react';
import FormElements from './formelements';

/**
 * All of the forms that are in the calculator come from here.
 * @type {{WhichRate(*): *}}
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
    // @TODO put together basic form here.
    return (
      <div
        className="calcPanel"
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
    return (Forms.BasicForm(<div>which rate</div>));
  },

  /**
   * Miles driven per year.
   *
   * @param   {Object}          props   Data passed down from top level component.
   * @returns {HTMLElement}
   */
  MilesPerYear(props) {
    return (Forms.BasicForm(<div>miles per year</div>));
  },

  /**
   * Charging hours.
   *
   * @param   {Object}          props   Data passed down from top level component.
   * @returns {HTMLElement}
   */
  ChargingHours(props) {
    return (Forms.BasicForm(<div>Charging hours</div>));
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
    return (Forms.BasicForm(
      <div>
        <FormElements.OutputColumn
          title="Flat rate"
          baseAnnual={props.annualFlat}
          carImpact={props.carImpactAnnualFlat}
          total={props.totalFlat}
        />
        <FormElements.OutputColumn
          title="TOU"
          baseAnnual={props.annualTOU}
          carImpact={props.carImpactAnnualTOU}
          total={props.totalTOU}
        />
        <p id="bestChoice">Your best rate:</p>
      </div>,
    ));
  },
};

module.exports = Forms;
