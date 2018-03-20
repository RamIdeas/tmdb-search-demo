import React from 'react';

interface Props {
    onClickLink(e: MouseEvent, anchor: HTMLAnchorElement): void;
}

export class ClickHijacker extends React.Component<Props> {
    componentDidMount() {
        document.addEventListener('click', this.onClick);
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.onClick);
    }

    onClick = (e: MouseEvent) => {
        const anchor = this.getAnchorElement(e.target as HTMLElement);
        const isPrimaryClick = e.buttons === 0;
        const isModiferKeyPressed = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
        if (isPrimaryClick && !isModiferKeyPressed) {
            e.preventDefault();
            this.onClickLink(e, anchor);
        }
    };

    getAnchorElement(el: HTMLElement): HTMLAnchorElement | undefined {
        if (el.tagName === 'A') return el as HTMLAnchorElement;
        if (el.parentElement === null) return undefined;
        return this.getAnchorElement(el.parentElement);
    }

    onClickLink(e: MouseEvent, anchor = this.getAnchorElement(e.target as HTMLElement)) {
        this.props.onClickLink(e, anchor);
    }

    render() {
        return this.props.children;
    }
}
