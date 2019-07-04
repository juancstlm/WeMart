import Header from "./header";
import Footer from "./Footer";
import ItemsGrid from "./ItemsGrid";
import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Button, DropdownMenu, MenuItem } from "ic-snacks";
import {
  getDepartmentItems,
  getSavingsItems,
  searchItems
} from "../services/api";

const Search = ({ history, location }) => {
  const [items, setItems] = useState([]);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getQuery();
  }, []);

  const getQuery = () => {
    const queryParams = new URLSearchParams(location.search);
    setQuery(queryParams.get("query"));
    let special = queryParams.get("special");

    if (special === "true") {
      if (query === "savings") {
        getSavingsItems().then(result => {
          setItems(result);
          setFinishedLoading(true);
        });
      } else {
        getDepartmentItems(query).then(result => {
          setItems(result);
          setFinishedLoading(true);
        });
      }
    } else {
      searchItems(query).then(result => {
        setItems(result);
        setFinishedLoading(true);
      });
    }
  };

  const renderItems = () => {
    if (items.length !== 0) {
      return <ItemsGrid items={items} />;
    } else if (finishedLoading) {
      return (
        <h1
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "30vh",
            color: "gray"
          }}
        >
          No items found
        </h1>
      );
    }
  };

  const sortBy = option => {
    if (option === "lowtohigh") {
      setItems({
        items: items.sort(function(a, b) {
          let priceA = a.sale !== 0 ? a.sale : a.price;
          let priceB = b.sale !== 0 ? b.sale : b.price;
          console.log(priceB);
          return priceA - priceB;
        })
      });
    } else if (option === "hightolow") {
      setItems({
        items: items.sort(function(a, b) {
          let priceA = a.sale !== 0 ? a.sale : a.price;
          let priceB = b.sale !== 0 ? b.sale : b.price;
          return priceB - priceA;
        })
      });
    } else if (option === "name") {
      setItems({
        items: items.sort(function(a, b) {
          return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
        })
      });
    }
  };

  const renderSortingMenu = () => {
    window.scroll(0, 0);
    const astext = {
      background: "none",
      border: "none",
      margin: "0",
      padding: "0",
      marginTop: "14px",
      fontSize: "1.25em",
      textAlign: "center"
    };

    const dropdownButton = {
      background: "none",
      border: "none",
      margin: "7px 0 7px 8px",
      padding: "0",
      fontSize: "1.15em",
      textAlign: "center",
      fontWeight: "200"
    };

    return (
      <div className="dropdown" style={{ margin: "16px" }}>
        <button
          className="dropdown-toggle primaryRedWithHover"
          style={astext}
          type="button"
          id="dropdownMenuHeader"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
        >
          Sorting by
          <span className="cart"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          <li>
            <button
              className="primaryRedWithHover"
              style={dropdownButton}
              onClick={() => sortBy("lowtohigh")}
            >
              Price: Low to High
            </button>
          </li>
          <li>
            <button
              className="primaryRedWithHover"
              style={dropdownButton}
              onClick={() => sortBy("hightolow")}
            >
              Price: High to Low
            </button>
          </li>
          <li>
            <button
              className="primaryRedWithHover"
              style={dropdownButton}
              onClick={() => sortBy("name")}
            >
              Alphabetical
            </button>
          </li>
        </ul>
      </div>
    );
  };
  return (
    <div>
      <Header />
      <div id="pageBody" style={{ minHeight: window.innerHeight - 228 }}>
        {renderSortingMenu()}
        {renderItems()}
      </div>
      <Footer />
    </div>
  );
};
export default withRouter(Search);
