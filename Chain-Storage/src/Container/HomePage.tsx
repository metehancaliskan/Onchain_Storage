import React from "react";

import {
  Footer,
  Blog,
  Possibility,
  Header,
  WhatChainStorage,
  Features,
} from "./containers";
import { CTA, Brand } from "./components";
import { Navbar } from "./components/navbar/NavbarMain";
import "./App.css";

export const HomePage = () => {
  return (
    <div className="App">
      <div className="gradient__bg">
        <Navbar />
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
