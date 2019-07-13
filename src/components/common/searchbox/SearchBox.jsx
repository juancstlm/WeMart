import React from "react";
import { connectSearchBox } from "react-instantsearch-dom";

const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => {
  return (
    <div className={"searchbox"}>
      <form>
        <input type={"search"}></input>
        <button></button>
        <button></button>
      </form>
    </div>
  );
};

export default connectSearchBox(SearchBox);
