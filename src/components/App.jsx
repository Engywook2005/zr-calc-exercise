import React from 'react';
import Ajax from '../utils/ajax';
import Modals from './supporting/modals';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rateDefs: {
        flatRate: {
          1: 0.15,
        },
        tou: {
          1: 0.08,
          12: 0.2,
          18: 0.08,
        },
      },
      carChargingHours: {
        start: 0,
        end: 0,
      },
      milesPerYear: 0,
      annualFlat: 0,
      annualTOU: 0,
      carImpactAnnualFlat: 0,
      carImpactAnnualTOU: 0,
      calculating: true,
    };
  }

  componentDidMount() {
    this.checkCalculating();
  }

  componentDidUpdate() {
    this.checkCalculating();
  }

  /**
   * If calculating state is true, pull load profile and assemble rates.
   */
  checkCalculating() {
    if (this.state.calculating) {
      Ajax.doAjaxQuery('./data/loadProfile')
        .then((data) => {

        });
    }
  }

  setState(newState) {
    // If key of newState is rateDefs, need to set calculating to true as well.
  }

  render() {
    const { calculating } = this.state;
    const calcModal = calculating ? Modals.CalculatingModal() : <div />;

    return (
      <div>
        {calcModal}
        <p>Howdy ho!</p>
      </div>
    );
  }
}

module.exports = App;
