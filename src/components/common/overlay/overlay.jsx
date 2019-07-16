import React from "react";
import "./overlay.css";
import PropTypes from "prop-types";

export const Overlay = ({ active, onClick }) => {
  const classes = active ? "overlay active" : "overlay";

  return <div className={classes} onClick={onClick} />;
};

Overlay.propTypes = {
  /*Activates the overlay*/
  active: PropTypes.bool,
  /*Function to execute when the overlay is clicked */
  onClick: PropTypes.func
};
