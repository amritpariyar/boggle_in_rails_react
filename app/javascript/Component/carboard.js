import React, { Component } from "react";
const Cardboard = props => {
  return (
    <table className="table table-bordered text-center">
      <tbody>{props.generateTable()}</tbody>
    </table>
  );
};

export default Cardboard;
