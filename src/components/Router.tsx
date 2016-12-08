import * as React from "react";
import { Navigation, navigation, NotFound, url } from "../routes";

interface RouterState {
  navigation: Navigation | NotFound;
}

export interface RouterProps {
  navigation: Navigation | NotFound;
  navigateTo: (navigation: Navigation) => void;
}

export default function Router<T extends RouterProps>(Component: React.ComponentClass<T>): React.ComponentClass<Partial<T>> {
  return class extends React.Component<T, RouterState> {
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
        navigateTo={this.navigateTo.bind(this)}
      />;
    }
  };
}
