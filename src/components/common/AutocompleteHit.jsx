import React from "react";
import PropTypes from "prop-types";

const AutocompleteHit = ({ hit, onClick }) => {
  return (
      <div key={hit.objectID} className={"suggestion"} onClick={onClick}>
        <div className={"hit"}>
          <img className={"image-attribute"} alt={hit.name} src={hit.image} />
          <span className={"primary-attribute"}>{hit.name}</span>
        </div>
      </div>
  );
};

export default AutocompleteHit;

AutocompleteHit.propTypes = {
  hit: PropTypes.object,
  onClick: PropTypes.func
};
