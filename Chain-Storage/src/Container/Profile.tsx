import React from "react";
import { GetFiles } from "../Components/Profile/GetFiles";
import { NavbarLogin } from "./components/navbar/Navbar.login";

export class Profile extends React.Component {
  render() {
    return (
      <>
        <NavbarLogin />
        <GetFiles />
      </>
    );
  }
}
