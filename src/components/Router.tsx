import * as React from "react";
import { Navigation, NotFound, navigation, url } from "../routes";

interface RouterState {
  navigation: Navigation | NotFound;
}

export default (Component) => class extends React.Component<{}, RouterState> {
  constructor() {
    super();

    this.state = {
      navigation: navigation(window.location.pathname),
    };
  }

  componentDidMount() {
    window.onpopstate = (event) => {
      if (event.state !== null) { // should this use history.length instead?
        this.setState({
          navigation: event.state,
        });
      }
    };
  }

  navigateTo(navigation: Navigation) {
    history.pushState(navigation, "", url(navigation));

    this.setState({
      navigation: navigation,
    });
  }

  render() {
    return <Component
      {...this.props}
      navigation={this.state.navigation}
      navigateTo={this.navigateTo.bind(this)} />;
  }
};