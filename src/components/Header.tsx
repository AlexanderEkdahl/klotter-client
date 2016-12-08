import * as React from "react";
import { Routes } from "../routes";

interface IHeaderProps {
    navigateTo: (newRoute: Routes) => void;
    route: Routes;
}

export default class Header extends React.PureComponent<IHeaderProps, {}> {
    linkProps(route: Routes): React.HTMLProps<HTMLDivElement> {
        if (this.props.route.id === route.id) {
            return { style: { ...styles.link, borderBottom: "3px solid red" } };
        }

        return {
            style: styles.link,
            onClick: () => { this.props.navigateTo(route); },
        };
    }

    render(): JSX.Element {
        const route = this.props.route;

        switch (route.id) {
            case "message":
                return (
                    <div style={styles.nav}>
                        <div style={styles.link} onClick={() => { this.props.navigateTo(route.prev); } }>Back</div>
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
        cursor: "pointer",
    } as React.CSSProperties,
};
