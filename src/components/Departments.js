import React, { Component, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Header from "./header";
import Footer from "./Footer";
import { DynamoDB } from "aws-sdk/index";
import {
  getDepartments
} from "../services/api";

const Departments = ({ history }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getDepartments().then(data => setDepartments(data));
  }, []);

  const renderDepartments = departments => {
    console.log("departments funct", departments);
    const gridItem = {
      border: "1.5px solid gray",
      borderRadius: "10px",
      fontSize: "1.2em",
      textAlign: "center",
      marginBottom: "5vw",
      height: "minmax(150px, 1fr)",
      overflow: "hidden",
      cursor: "pointer"
    };

    // Inline sort by department name
    let sorted = departments.sort((a, b) => {
      return a.departmentid > b.departmentid
        ? 1
        : b.departmentid > a.departmentid
        ? -1
        : 0;
    });

    return sorted.map(dep => (
      <div style={gridItem} onClick={() => handleClick(dep.departmentid)}>
        <img
          alt={dep.departmentid}
          src={dep.image}
          style={{
            width: "80%",
            marginLeft: "20%",
            borderRadius: "0 10px 0 0"
          }}
        />
        {dep.departmentid}
      </div>
    ));
  };

  const handleClick = depName => {
    history.push({
      pathname: "/search",
      search: "?query=" + encodeURIComponent(depName) + "&special=true"
    });
  };

  const gridContainer = {
    display: "grid",
    gridTemplateColumns: "repeat( auto-fit, minmax(150px, 1fr) )",
    gridColumnGap: "5%",
    margin: "5%",
    marginBottom: "0",
    width: "90%"
  };

  return (
    <div>
      <Header />
      <div id="pageBody">
        <div style={gridContainer}>{renderDepartments(departments)}</div>
      </div>

      <Footer />
    </div>
  );
};
export default withRouter(Departments);
