import Link from "next/link";
import * as React from "react";
import { FC, useState, useEffect } from "react";
import { Clrs } from "../styled/consts";

const Header: FC = () => {
  return (
    <div
      style={{
        textAlign: "center",
        background: Clrs.primary,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Link href="/">
        <h1 style={{ margin: "0px", cursor: "pointer" }}>Well of Sound</h1>
      </Link>
    </div>
  );
};

export default Header;
