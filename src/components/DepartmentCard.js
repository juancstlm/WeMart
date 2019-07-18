import React from "react";
import {withRouter} from "react-router-dom";
import {PropTypes} from "prop-types";
import {LoadingBox} from "ic-snacks";
import "./departmentcard.css"

const DepartmentCard = ({ history, department, onClick, loading }) => {
  const gridItem = {
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
    position: 'absolute',
    fontweight: 600,
    bottom: 0,
    width: '100%',
    margin: '8px auto',
    webkitBoxOrient: "vertical",
    overflow: "hidden"
  };

  const loadingBox = (
    <div style={gridItemLoading}>
      <LoadingBox background={"light"} shape={"square"} size={200}/>
    </div>
  );

  const card = (
    <div className={"wmrt-DepartmentCard-gridItem"} onClick={onClick}>
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
