import React from "react";

import {
  Footer,
  Blog,
  Possibility,
  Header,
  WhatChainStorage,
  Features,
} from "./containers";
import { CTA, Brand, Navbar } from "./components";

import "./App.css";

export const HomePage = () => {
  return (
    <div className="App">
      <div className="gradient__bg">
        <Header />
      </div>
      <Brand />
      <WhatChainStorage />
      <Features />
      <Possibility />
      <CTA />
      <Blog />
      <Footer />
    </div>
  );
};
