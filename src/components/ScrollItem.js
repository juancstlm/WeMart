import React, { Component } from "react";
import ItemCard from "./ItemCard";
import DepartmentCard from "./DepartmentCard";

const ScrollItem = ({ item }) => {
  let liStyle = {};

  if (window.innerWidth < 550) {
    liStyle = {
      display: "inline-block",
      position: "relative",
      cursor: "pointer",
      verticalAlign: "middle",
      padding: "0 3%",
      width: "150px",
      whiteSpace: "initial"
    };
  } else {
    liStyle = {
      display: "inline-block",
      position: "relative",
      cursor: "pointer",
      verticalAlign: "middle",
      padding: "0 3%",
      width: "250px",
      whiteSpace: "initial"
    };
  }

  function Items() {
    return <ItemCard key={item} item={item} inCart={0} />;
  }

  function Departments(props) {
    return <DepartmentCard department={props.dept} />;
  }

  function RenderScrollItem(props) {
    const isDepartment = props.isDepartment;
    if (isDepartment) {
      return <Departments dept={item} />;
    } else {
      return <Items />;
    }
  }

  return (
    <li style={liStyle}>
      <RenderScrollItem isDepartment={item.itemid == null} />
    </li>
  );
};

export default ScrollItem;
