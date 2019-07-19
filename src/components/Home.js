import React, {useEffect, useState} from "react";
import HorizontalScroll from "./HorizontalScroll";
import Header from "./header";
import Footer from "./Footer";
import {withRouter} from "react-router-dom";
import itemsEmpty from "../images/items_empty.png";
import {getCogtnioUser, getDepartments, getSavingsItems} from "../services/api";

const Home = ({ history }) => {
  const [departments, setDepartments] = useState([]);
  const [savingsItems, setSavingsItems] = useState([]);
  const [historyItems, ] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [orderHistory, ] = useState(new Set());
  const [user, setUser] = useState(null);

  useEffect(() => {
    getCogtnioUser().then(result => {
      setUser({ email: result });
      setIsLoggedIn(true);
      // getOrderHistory(result)
    });
    getDepartments(10).then(result => {
      setDepartments(result);
    });
    getSavingsItems(50).then(result => {
      setSavingsItems(result);
    });
  }, []);

  // const getItemsFromDB = () => {
  //   orderHistory.forEach(itemid => {
  //     //TODO call getItemFrom DB on each item
  //   });
  // };

  const handleSeeMoreClick = link => {
    history.push("/" + link);
  };

  const renderHistory = () => {
    if (user === null) {
      return noHistory();
    } else if (historyItems.length !== 0) {
      return (
        <HorizontalScroll
          onSeeMoreClick={() => handleSeeMoreClick("history")}
          items={historyItems}
          title="History"
        />
      );
    } else if (isLoggedIn) {
      return noHistory();
    }
  };

  const noHistory = () => {
    const scrollWrapper = {
      backgroundColor: "white",
      border: "2px solid #efefef",
      margin: "3%",
      borderRadius: "5px" /* 5px rounded corners */,
      boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)"
    };

    const scrollerTitle = {
      color: "red",
      position: "sticky",
      height: "20%",
      backgroundColor: "white",
      padding: "0",
      borderRadius: "0",
      margin: "8px 0 12px 3%"
    };

    const wrapper = {
      width: "100%",
      textAlign: "center",
      marginBottom: "12px"
    };
    return (
      <div style={scrollWrapper}>
        <div style={scrollerTitle}>
          <span className="lead">History</span>
        </div>
        <div style={wrapper}>
          <div>
            <img alt={'test'} src={itemsEmpty} style={{ maxWidth: "20%" }} />
          </div>
          <h1>No Items</h1>
          <h4>
            Items that you order will show up here, so that you can quickly find
            your items again
          </h4>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div id="pageBody">
        <HorizontalScroll
          onSeeMoreClick={() => handleSeeMoreClick("departments")}
          items={departments}
          title="Browse by Department"
        />
        <HorizontalScroll
          onSeeMoreClick={() =>
            handleSeeMoreClick("search?query=savings&special=true")
          }
          items={savingsItems}
          title="Savings"
        />
        {renderHistory()}
      </div>
      <Footer />
    </div>
  );
};

export default withRouter(Home);
