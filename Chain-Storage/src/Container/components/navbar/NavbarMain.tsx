import React, { useState } from "react";
import { RiMenu3Line, RiCodeLine } from "react-icons/ri";
import logo from "../../assets/logo.svg";
import "./navbar.css";
import { Link } from "react-router-dom";

declare let window: any;

async function requestAccount() {
  console.log(window.ethereum.selectedAddress);
  const connect: any = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  window.location.href = "/profile";
}

const Menu = () => (
  <>
    <p>
      <Link to="/">Home</Link>
    </p>
    <p>
      <Link to="/profile">Profile</Link>
    </p>
    <p>
      <Link to="/profile/buyStorage">Buy Storage</Link>
    </p>
  </>
);

interface IState {
  toggleMenu: boolean;
  isLogin: boolean;
}

export class Navbar extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.setToggleMenu = this.setToggleMenu.bind(this);

    this.state = {
      toggleMenu: false,
      isLogin: false,
    };
  }

  setToggleMenu(e: any) {
    this.setState({ toggleMenu: e.target });
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
            <button onClick={requestAccount}>Login With Metamask</button>
          </div>
        </div>
      </div>
    );
  }
}
