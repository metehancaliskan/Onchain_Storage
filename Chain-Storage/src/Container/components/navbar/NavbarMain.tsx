import React, { useState } from "react";
import { RiMenu3Line, RiCodeLine } from "react-icons/ri";
import logo from "../../assets/logo.svg";
import axios from "axios";
import "./navbar.css";
import Cookies from "js-cookie";
import { instanceOf } from "prop-types";

import { Link } from "react-router-dom";

declare let window: any;

const Menu = () => (
  <>
    <p>
      <Link to="/">Home</Link>
    </p>
    <p>
      <Link to="/profile">Profile</Link>
    </p>
    <p>
      <Link to="/importAccount/">Import Account</Link>
    </p>
    <p>
      <Link to="/profile/buyStorage">Buy Storage</Link>
    </p>
  </>
);

interface IState {
  toggleMenu: boolean;
  isLogin: boolean;
  token: string;
}

export class Navbar extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.setToggleMenu = this.setToggleMenu.bind(this);
    this.requestAccount = this.requestAccount.bind(this);

    this.state = {
      toggleMenu: false,
      isLogin: false,
      token: "",
    };
  }

  setToggleMenu(e: any) {
    this.setState({ toggleMenu: e.target });
  }

  async requestAccount() {
    console.log(window.ethereum.selectedAddress);
    const connect: any = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const userObject = {
      userPulicKey: window.ethereum.selectedAddress,
    };

    console.log(window.ethereum.selectedAddress);

    axios.post("http://localhost:4000/login/", userObject).then((data) => {
      console.log(data.data);
      console.log(data);
      this.setState({ token: data.data.data });
      Cookies.set("token", data.data.data);
    });

    window.location.href = "/profile";
  }

  componentDidMount(): void {
    console.log(window?.ethereum);
  }

  render(): React.ReactNode {
    return (
      <div>
        <div className="gpt3__navbar">
          <div className="gpt3__navbar-links">
            <div className="gpt3__navbar-links_logo">
              {/*<img src={logo} alt='logo'/>*/}
              <p>
                <a>chain Storage Development</a>
              </p>
            </div>
            <div className="gpt3__navbar-links_container">
              <Menu />
            </div>
          </div>
          <div className="gpt3__navbar-sign">
            <button onClick={this.requestAccount}>Login With Metamask</button>
          </div>
        </div>
      </div>
    );
  }
}
