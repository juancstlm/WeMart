import React from "react";
import {withRouter} from "react-router-dom";
import {PropTypes} from "prop-types";
import {LoadingBox} from "ic-snacks";

const DepartmentCard = ({ history, department, onClick, loading }) => {
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

  const gridItemLoading = {
    borderRadius: "10px",
    fontSize: "1.2em",
    marginBottom: "5vw",
    height: "minmax(150px, 1fr)",
    overflow: "hidden",
  }

  const webkitEllipsis = {
    display: "-webkit-box",
    webkitLineClamp: "1",
    webkitBoxOrient: "vertical",
    overflow: "hidden"
  };

  const loadingBox = (
    <div style={gridItemLoading}>
      <LoadingBox background={"light"} shape={"square"} size={200}/>
    </div>
  );

  const card = (
    <div style={gridItem} onClick={onClick}>
      <img
        alt={department.image}
        src={department.image}
        style={{ width: "80%", marginLeft: "20%", borderRadius: "0 10px 0 0" }}
      />
      <span style={webkitEllipsis}>{department.departmentid}</span>
    </div>
  );

  return loading ? loadingBox : card;
};

export default withRouter(DepartmentCard);

DepartmentCard.propTypes = {
  department: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  loading: PropTypes.boolean
};
