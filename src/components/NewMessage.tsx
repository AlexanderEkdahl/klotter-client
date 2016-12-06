import * as React from "react";
import { Message } from "../models";
import * as moment from "moment";
import haversine from "../haversine";

interface NewMessageProps {
  onSubmit: (value: string) => void;
  placeholder: string;
}

interface NewMessageState {
  value: string;
}

export default class NewMessage extends React.Component<NewMessageProps, NewMessageState> {
  constructor() {
    super();

    this.state = {
      value: "",
    };
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  handleSubmit(event) {
    this.props.onSubmit(this.state.value);
    this.setState({
      value: "",
    });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} style={styles.form}>
        <input onChange={this.handleChange.bind(this)} style={styles.input} value={this.state.value} placeholder={this.props.placeholder} />
        <input type="submit" value="Comment" style={styles.submit} />
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
    margin: 0,
    fontSize: 16,
    outline: "none",
    flexGrow: 1,
    padding: 5,
  },

  submit: {
    margin: 0,
    fontSize: 20,
    backgroundColor: "#FF00000",
    border: "none",
    color: "white",
    outline: "none",
  },
};