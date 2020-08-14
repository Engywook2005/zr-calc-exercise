import React from 'react';
import Ajax from '../utils/ajax';
import AnnualRateCalculator from '../utils/annualRateCalculator';
import Forms from './forms/forms';
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
      userRate: null,
      carChargingHours: {
        start: 0,
        end: 0,
      },
      milesPerYear: 0,
      annualFlat: 0,
      annualTOU: 0,
      carImpactAnnualFlat: 0,
      carImpactAnnualTOU: 0,
      totalFlat: 0,
      totalTOU: 0,
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
    // @TODO Will need to set calculating to true if state includes change to rateDefs.

    const annualFlat = newState.annualFlat || this.state.annualFlat;
    const annualTOU = newState.annualTOU || this.state.annualTOU;
    const carImpactAnnualFlat = newState.carImpactAnnualFlat || this.state.carImpactAnnualFlat;
    const carImpactAnnualTOU = newState.carImpactAnnualTOU || this.state.carImpactAnnualTOU;

    const totalFlat = annualFlat + carImpactAnnualFlat;
    const totalTOU = annualTOU + carImpactAnnualTOU;

    newState.totalFlat = totalFlat;
    newState.totalTOU = totalTOU;

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
    const calcModal = calculating ? <Modals.CalculatingModal /> : <div />;
    const { userRate } = this.state;
    const { milesPerYear } = this.state;
    const { carChargingHours } = this.state;
    const { annualFlat } = this.state;
    const { annualTOU } = this.state;
    const { carImpactAnnualFlat } = this.state;
    const { carImpactAnnualTOU } = this.state;
    const { totalFlat } = this.state;
    const { totalTOU } = this.state;

    return (
      <div>
        {calcModal}
        <div className="calculator">
          <Forms.WhichRate
            userRate={userRate}
          />
          <Forms.MilesPerYear
            milesPerYear={milesPerYear}
          />
          <Forms.ChargingHours
            chargingStart={carChargingHours.start}
            chargingEnd={carChargingHours.end}
          />
          <Forms.Output
            annualFlat={annualFlat}
            annualTOU={annualTOU}
            carImpactAnnualFlat={carImpactAnnualFlat}
            carImpactAnnualTOU={carImpactAnnualTOU}
            totalFlat={totalFlat}
            totalTOU={totalTOU}
            userRate={userRate}
          />
        </div>
      </div>
    );
  }
}

module.exports = App;
