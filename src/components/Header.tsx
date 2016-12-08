import * as React from "react";
import { Navigation } from "../routes";

interface HeaderProps {
    navigateTo: (newNavigation: Navigation) => void;
    navigation: Navigation;
}

export default class Header extends React.PureComponent<HeaderProps, {}> {
    linkProps(navigation: Navigation): React.HTMLProps<HTMLDivElement> {
        if (this.props.navigation.id === navigation.id) {
            return { style: {...styles.link, borderBottom: "3px solid red" } };
        }

        return {
            style: styles.link,
            onClick: () => { this.props.navigateTo(navigation); }
        };
    }

    render(): JSX.Element {
        const navigation = this.props.navigation;

        switch (navigation.id) {
            case "message":
                return (
                    <div style={styles.nav}>
                        <div style={styles.link} onClick={() => { this.props.navigateTo(navigation.prev); } }>Back</div>
                    </div>
                );
            case "map":
            case "user":
            case "list":
                return (
                    <div style={styles.nav}>
                        <div>
                            <span {...this.linkProps({ id: "list" }) }>List</span>
                            <span {...this.linkProps({ id: "map" }) }>Map</span>
                        </div>
                        <div>
                            <span {...this.linkProps({ id: "user" }) }>User</span>
                        </div>
                    </div>
                );
        }
    }
}

const styles = {
    nav: {
        display: "flex",
        fontSize: 20,
        justifyContent: "space-between",
        height: 50,
    } as React.CSSProperties,

    link: {
        paddingLeft: 10,
        paddingRight: 10,
        height: 47,
        display: "block",
        float: "left",
        lineHeight: "47px",
        cursor: "pointer"
    } as React.CSSProperties,
};