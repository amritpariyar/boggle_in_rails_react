import React, { Component } from "react";
const WordInput = props => {
  const { wordtyped, handleTypedWord, focus } = props;
  return (
    <input
      type="text"
      value={wordtyped}
      onChange={handleTypedWord}
      autoFocus={focus}
    ></input>
  );
};

export default WordInput;
