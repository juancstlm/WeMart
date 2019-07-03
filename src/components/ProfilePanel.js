import React from "react";
import PropTypes from "prop-types";

//STYLES
const profilePanel = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #d30707",
  borderRadius: ".6rem",
  marginBottom: "2rem",
  marginRight: "2rem",
  marginLeft: "2rem"
};
const profilePanel_h4 = {
  fontWeight: "800",
  fontSize: "1.8rem",
  lineHeight: "1.8rem",
  padding: "2rem 3rem",
  margin: "0"
};

export default class ProfilePanel extends React.Component {
  render() {
    return (
      <div style={profilePanel}>
        {/*Profile Panel Title*/}
        <h4 style={profilePanel_h4}>{this.props.title}</h4>
        {/*Profile Panel Content*/}
        {this.props.content}
        {this.props.children}
      </div>
    );
  }
}

ProfilePanel.propTypes = {
  children: PropTypes.node,
  content: PropTypes.node,
  title: PropTypes.string.isRequired,
  size: PropTypes.string
};
