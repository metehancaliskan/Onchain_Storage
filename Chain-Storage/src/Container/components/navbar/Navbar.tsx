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
const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
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
      <div className="gpt3__navbar-menu">
        {toggleMenu ? (
          <RiCodeLine
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(false)}
          />
        ) : (
          <RiMenu3Line
            color="#fff"
            size={27}
            onClick={() => setToggleMenu(true)}
          />
        )}
        {toggleMenu && (
          <div className="gpt3__navbar-menu_container scale-up-center">
            <div className="gpt3__navbar-menu_container-links">
              <Menu />
              <div className="gpt3__navbar-menu_container-links-sign">
                <p>Sign In</p>
                <button onClick={requestAccount}>Sign Up</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
