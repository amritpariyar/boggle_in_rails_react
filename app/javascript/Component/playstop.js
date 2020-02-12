import React, { Component } from "react";
const PlayStop = props => {
  const { doPlayStop, isPlayOrStop } = props;
  return (
    <button
      onClick={doPlayStop}
      className="btn btn-outline-success btn-disabled"
    >
      {isPlayOrStop}
    </button>
  );
};

export default PlayStop;
