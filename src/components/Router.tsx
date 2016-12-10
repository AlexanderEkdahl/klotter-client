import * as React from "react";
import { INotFound, route, Routes, url } from "../routes";

interface IRouterState {
  route: Routes | INotFound;
}

export interface IRouterProps {
  route: Routes | INotFound;
  navigateTo: (route: Routes) => void;
}

export default function Router<T extends IRouterProps>(Component: React.ComponentClass<T>): React.ComponentClass<any> {
  return class extends React.Component<T, IRouterState> {
    boundOnPopState = this.onPopState.bind(this);

    constructor() {
      super();

      this.state = {
        route: route(window.location.pathname),
      };
    }

    onPopState(event: PopStateEvent) {
      if (event.state !== null) { // should this use history.length instead?
        this.setState({
          route: event.state,
        });
      }
    }

    componentDidMount() {
      window.addEventListener("popstate", this.boundOnPopState);
    }

    componentWillUnmount() {
      window.removeEventListener("popstate", this.boundOnPopState);
    }

    navigateTo(route: Routes) {
      history.pushState(route, "", url(route));

      this.setState({
        route: route,
      });
    }

    render() {
      return (
        <Component
          {...this.props}
          route={this.state.route}
          navigateTo={this.navigateTo.bind(this)}
        />
      );
    }
  };
}
