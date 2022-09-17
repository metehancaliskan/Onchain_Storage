import React from "react";
import "../Profile/GetFiles.css";
import axios from "axios";
import Cookies from "js-cookie";
import { NavbarLogin } from "../../Container/components/navbar/Navbar.login";

// import { Link } from "react-router-dom";

declare let window: any;

interface State {
  myToken: any;
}

export class importAccount extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);

    this.tokenChangedHandler = this.tokenChangedHandler.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      myToken: null,
    };
  }

  public tokenChangedHandler(e: any) {
    this.setState({ myToken: e.target.value });
  }

  async onSubmit(e: any) {
    e.preventDefault();

    console.log(this.state.myToken);

    Cookies.set("token", this.state.myToken);
    const tokenData = {
      token: this.state.myToken,
    };

    axios
      .post("http://localhost:4000/importAccount/", tokenData)
      .then((data) => {
        console.log(data);
        if (
          data.data.data.userPulicKey.toLowerCase() ===
          window.ethereum.selectedAddress.toLowerCase()
        ) {
          console.log("ok pass");
          alert("Account Imported");
        } else {
          console.log("pleas logggiiiiiin it's worng keeeey");
          alert("wrong key");
        }
      });

    this.setState({ myToken: "" });
  }

  render(): React.ReactNode {
    return (
      <>
        <div>
          <NavbarLogin />
          <form onSubmit={this.onSubmit}>
            <label>Token</label>
            <input
              type="text"
              value={this.state.myToken}
              onChange={this.tokenChangedHandler}
            />
            <input type="submit" value="submit" />
          </form>
        </div>
      </>
    );
  }
}
