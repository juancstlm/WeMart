import React from "react";
import {
  connectAutoComplete,
  SearchBox,
  Highlight
} from "react-instantsearch-dom";
import "./autocomplete.css";
import AutocompleteHit from "./AutocompleteHit";
import { withRouter } from "react-router-dom";

const Autocomplete = ({ hits, currentRefinement, refine, history }) => {
  const handleOnHitClick = itemid => {
    history.push({
      pathname: "/item",
      search: "?id=" + itemid
    });
  };

  const autocompleteResults =
    currentRefinement !== "" ? (
      <div className={"autocomplete"}>
        {hits.map(hit => (
          <AutocompleteHit
            hit={hit}
            onClick={() => handleOnHitClick(hit.itemid)}
          />
        ))}
      </div>
    ) : null;

  return (
    <div className={"searchBox"}>
      <SearchBox defaultRefinement="" />
      {autocompleteResults}
    </div>
  );
};

export default connectAutoComplete(withRouter(Autocomplete));
