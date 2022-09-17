import { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { Profile } from "./Container/Profile";
import { BuyStorageClass } from "./Container/BuyStorage";
import { HomePage } from "./Container/HomePage";
import { importAccount } from "./Components/Profile/ImportAccount";

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/profile/" component={Profile} />
          <Route exact path="/importAccount/" component={importAccount} />
          <Route exact path="/profile/buyStorage" component={BuyStorageClass} />
        </Switch>
      </div>
    );
  }
}

export default App;
