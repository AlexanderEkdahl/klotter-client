import * as React from "react";

interface IInlineSVGProps {
  src: string;
}

export default class InlineSVG extends React.PureComponent<IInlineSVGProps, {}> {
  render() {
    return (
      <i dangerouslySetInnerHTML={{ __html: this.props.src }} />
    );
  }
}
