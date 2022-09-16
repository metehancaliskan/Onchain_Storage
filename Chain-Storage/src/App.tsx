import { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Profile } from "./Container/Profile";
import { BuyStorageClass } from "./Container/BuyStorage";
import { HomePage } from "./Container/HomePage";
import { Navbar } from "./Container/components";

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/profile/" component={Profile} />
          <Route exact path="/profile/buyStorage" component={BuyStorageClass} />
        </Switch>
      </div>
    );
  }
}

export default App;
