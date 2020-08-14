import React from 'react';
import Ajax from '../utils/ajax';
import AnnualRateCalculator from '../utils/annualRateCalculator';
import Modals from './supporting/modals';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rateDefs: {
        flatRate: 0.15,
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

  setState(newState) {
    // Will need to set calculating to true if state includes change to rateDefs.

    super.setState(newState);
  }

  /**
   * If calculating state is true, pull load profile and assemble rates.
   */
  checkCalculating() {
    const { rateDefs } = this.state;
    const { calculating } = this.state;

    if (calculating) {
      Ajax.doAjaxQuery(`./data/loadProfile?cb=${Math.floor(Math.random() * 10000000)}`)
        .then((data) => {
          const loadProfile = JSON.parse(data);
          const newRates = AnnualRateCalculator.getRateFromProfile(rateDefs, loadProfile);

          const newState = {
            annualFlat: newRates.flatRate,
            annualTOU: newRates.tou,
            calculating: false,
          };

          this.setState(newState);
        })
        .catch((err) => {
          console.log(`Ooopsssssss.... ${err}`);
        });
    }
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
