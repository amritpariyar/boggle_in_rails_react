import React, { Component } from "react";
const Randomize = props => {
  const { doRandomize } = props;
  return (
    <button onClick={doRandomize} className="btn btn-outline-primary">
      Random Word
    </button>
  );
};

export default Randomize;
