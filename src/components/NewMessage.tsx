import * as React from "react";
import InlineSVG from "./InlineSVG";

interface INewMessageProps {
  onSubmit: (value: string) => void;
  placeholder: string;
}

interface INewMessageState {
  value: string;
}

export default class NewMessage extends React.Component<INewMessageProps, INewMessageState> {
  constructor() {
    super();

    this.state = {
      value: "",
    };
  }

  handleChange(event: any) {
    this.setState({
      value: event.target.value,
    });
  }

  handleSubmit(event: any) {
    this.props.onSubmit(this.state.value);
    this.setState({
      value: "",
    });
    event.preventDefault();
  }

  render() {
    const icon = require<string>("../images/plane.svg");

    return (
      <form onSubmit={this.handleSubmit.bind(this)} style={styles.form}>
        <input onChange={this.handleChange.bind(this)} style={styles.input} value={this.state.value} placeholder={this.props.placeholder} />
        <button type="submit" style={styles.submit}>
          <InlineSVG src={icon} />
        </button>
      </form>
    );
  }
}

const styles = {
  form: {
    alignItems: "stretch",
    display: "flex",
  },

  input: {
    fontSize: 16,
    outline: "none",
    flexGrow: 1,
    padding: 5,
    border: "none",
  },

  submit: {
    border: "none",
    outline: "none",
    cursor: "pointer",
    width: 50,
    backgroundColor: "white",
    margin: 6,
  },
};
