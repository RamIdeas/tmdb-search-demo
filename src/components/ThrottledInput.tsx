import React, { ChangeEvent } from 'react';

interface Props {
    onChange(value: string);
    throttle?: number;
}

interface State {
    value: string;
}

export default class ThrottledInput extends React.Component<Props, State> {
    static defaultProps = {
        throttle: 250,
    };

    timerId?: NodeJS.Timer;

    constructor(props) {
        super(props);

        this.state = { value: '' };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e: ChangeEvent<HTMLInputElement>) {
        const { value } = e.target;

        this.setState({ value });

        clearTimeout(this.timerId);
        this.timerId = setTimeout(() => {
            this.props.onChange(this.state.value);
        }, this.props.throttle);
    }

    render() {
        const { onChange, throttle, ...props } = this.props;
        return <input {...props} value={this.state.value} onChange={this.onChange} />;
    }
}
