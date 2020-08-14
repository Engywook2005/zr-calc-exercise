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
        end: 8,
      },
      milesPerYear: 20000,
      annualFlat: 0,
      annualTOU: 0,
      carImpactAnnualFlat: 0,
      carImpactAnnualTOU: 0,
      totalFlat: 0,
      totalTOU: 0,
      calculating: true,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.checkCalculating();
  }

  componentDidUpdate() {
    this.checkCalculating();
  }

  // Overrides component setState method, doing the needed math when a state value changes
  // due to user input
  setState(newState) {
    // @TODO Will need to set calculating to true if state includes change to rateDefs.

    const annualFlat = newState.annualFlat || this.state.annualFlat;
    const annualTOU = newState.annualTOU || this.state.annualTOU;
    const rateDefs = newState.rateDefs || this.state.rateDefs;
    const carChargingHours = newState.carChargingHours || this.state.carChargingHours;
    const milesPerYear = newState.milesPerYear || this.state.milesPerYear;

    const carImpact = AnnualRateCalculator.getCarChargingCosts(rateDefs, carChargingHours, milesPerYear);

    const carImpactAnnualFlat = carImpact.flatRate;
    const carImpactAnnualTOU = carImpact.tou;

    const totalFlat = annualFlat + carImpactAnnualFlat;
    const totalTOU = annualTOU + carImpactAnnualTOU;

    const updatedNewState = newState;

    updatedNewState.carImpactAnnualFlat = carImpactAnnualFlat;
    updatedNewState.carImpactAnnualTOU = carImpactAnnualTOU;
    updatedNewState.totalFlat = totalFlat;
    updatedNewState.totalTOU = totalTOU;

    super.setState(updatedNewState);
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

  handleInputChange(newVal, propName) {
    const newState = {};
    newState[propName] = newVal;

    this.setState(newState);
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
    const { handleInputChange } = this;

    return (
      <div>
        {calcModal}
        <div className="calculator">
          <Forms.WhichRate
            userRate={userRate}
          />
          <Forms.MilesPerYear
            milesPerYear={milesPerYear}
            onchange={handleInputChange}
          />
          <Forms.ChargingHours
            carChargingHours={carChargingHours}
            onchange={handleInputChange}
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
