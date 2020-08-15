import React from 'react';

const Modals = {

  /**
   * Returns form element container
   *
   * @param {HTMLElement}   innerEl   Element containing the form proper.
   * @param {Object}        props     Used for positioning and other kinds of styling.
   * @returns {HTMLElement}
   */
  ModalBase(innerEl, props) {
    return (<div>{innerEl}</div>);
  },

  CalculatingModal(props) {
    return Modals.ModalBase(<div>Calculating...</div>);
  },
};

module.exports = Modals;
