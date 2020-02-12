import React, { Component } from "react";
const NewGame = props => {
  return (
    <button onClick={props.startNewGame} className="btn btn-outline-warning">
      New Game
    </button>
  );
};

export default NewGame;
