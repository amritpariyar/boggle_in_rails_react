import React, { Component } from "react";
const Submit = props => {
  return (
    <button
      onClick={props.handleSubmit}
      className="btn btn-sm btn-outline-success"
    >
      Submit
    </button>
  );
};

export default Submit;
