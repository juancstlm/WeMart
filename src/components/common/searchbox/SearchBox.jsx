import React from "react";
import { connectSearchBox } from "react-instantsearch-dom";
import './searchbox.css'

const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => {
  return (
    <div className={"searchbox"}>
      <form className={"searchform"}>
        <input
          className={'searchbox_input'}
          type={"search"}
          value={currentRefinement}
          onChange={e => refine(e.currentTarget.value)}
        ></input>
        <button className={'submit_search_button'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 18 18"
          >
            <g
              fill="none"
              fill-rule="evenodd"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.67"
              transform="translate(1 1)"
            >
              <circle cx="7.11" cy="7.11" r="7.11"></circle>
              <path d="M16 16l-3.87-3.87"></path>
            </g>
          </svg>
        </button>
        <button className={'searchbox_reset'}>X</button>
      </form>
    </div>
  );
};

export default connectSearchBox(SearchBox);
