import React from "react";
import PropTypes from "prop-types";
import ItemCard from "./ItemCard";

//STYLES
const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat( auto-fit, minmax(14.8rem, 1fr) )",
  gridColumnGap: "5%",
  margin: "2%"
};
const itemGrid_itemCard = {
  display: "inline-block",
  position: "relative",
  verticalAlign: "top",
  margin: "3%",
  maxWidth: "200px"
};

export default class ItemsGrid extends React.Component {
  constructor() {
    super();
    this.state = {
      currentTabIndex: null
    };
  }

  renderChildren() {
    return this.props.items.map(item => (
      <li style={itemGrid_itemCard} key={item.itemid}>
        <ItemCard
          item={item}
          inCart={0}
          key={item.itemid}
        />
      </li>
    ));
  }

  render() {
    return <div style={gridContainer}>{this.renderChildren()}</div>;
  }
}

ItemsGrid.propTypes = {
  items: PropTypes.array
};
