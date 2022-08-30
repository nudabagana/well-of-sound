import * as React from "react";
import { FC, useState, useEffect } from "react";
import { Clrs } from "../styles/consts";

const Header: FC = () => {
  return (
    <h1
      style={{ textAlign: "center", background: Clrs.primary, margin: "0px" }}
    >
      Well of Sound
    </h1>
  );
};

export default Header;
