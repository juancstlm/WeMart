import React, {useEffect, useState} from "react";
import {withRouter} from "react-router-dom";
import Header from "./header";
import Footer from "./Footer";
import {getDepartments} from "../services/api";
import DepartmentCard from "./DepartmentCard";
import PropTypes from "prop-types";

const Departments = ({ history, initialLoad }) => {
  const [departments, setDepartments] = useState(
    new Array(initialLoad).fill({ loading: true })
  );

  useEffect(() => {
    getDepartments().then(data => setDepartments(data));
  }, []);

  const renderDepartments = departments => {
    // Inline sort by department name
    let sorted = departments.sort((a, b) => {
      return a.departmentid > b.departmentid
        ? 1
        : b.departmentid > a.departmentid
        ? -1
        : 0;
    });

    return sorted.map(dep => (
      <DepartmentCard
        onClick={() => handleClick(dep.departmentid)}
        department={dep}
        loading={dep.loading}
      />
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

Departments.defaultProps = {
  initialLoad: 10
};

Departments.propTypes = {
  initialLoad: PropTypes.number
};
