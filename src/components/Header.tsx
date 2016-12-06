import * as React from "react";
import { Navigation } from "../routes";

interface HeaderProps {
    navigateTo: (newNavigation: Navigation) => void;
    navigation: Navigation;
    prevNavigation: Navigation | null;
}

export default class Header extends React.PureComponent<HeaderProps, {}> {
    render(): JSX.Element {
        switch (this.props.navigation.id) {
            case "message":
                return (
                    <div style={styles.nav}>
                        <div onClick={() => { this.props.navigateTo(this.props.prevNavigation!); } }>Back</div>
                    </div>
                );
            case "map":
            case "user":
            case "list":
                return (
                    <div style={styles.nav}>
                        <div onClick={() => { this.props.navigateTo({ id: "map" }); } } >Show map</div>
                        <div onClick={() => { this.props.navigateTo({ id: "list" }); } } >Show List</div>
                        <div onClick={() => { this.props.navigateTo({ id: "user" }); } } >User</div>
                    </div>
                );
        }
    }
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#FF0000",
    fontSize: 20,
    height: 50,
    cursor: "pointer",
    paddingLeft: 10,
    paddingRight: 10,
    textShadow: "1px 1px 0px rgba(0, 0, 0, 0.2)"
  } as React.CSSProperties,
};