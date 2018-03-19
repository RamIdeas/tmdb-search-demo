import React from 'react';
import { Title, Results } from '../types';
import { ClickHijacker } from './ClickHijacker';
import DataFetcher from './DataFetcher';

interface Props {
    pathname: string;
    query: string;
    results: Results;
    title: Title;
}

interface State {
    section?: 'movies' | 'tvshows';
    id?: number;
    query: string;
    results: Results;
    title: Title;
}

const ROUTE_REGEX = /^\/(?:(movies|tvshows)(?:\/(\d+))?)?$/;

class AppHistory extends React.Component<Props, State> {
    constructor(props) {
        super(props);

        const { pathname, query, results, title } = props;

        this.state = {
            ...this.deriveStateFromPathname(pathname),
            query,
            results,
            title,
        };

        const bindable: (keyof this)[] = [
            'onClickLink',
            'onPopState',
            'onChangeQuery',
            'onFetchResults',
            'onFetchTitle',
        ];
        for (const method of bindable) this[method] = this[method].bind(this);
    }

    componentDidMount() {
        window.addEventListener('popstate', this.onPopState);
    }
    componentWillUnmount() {
        window.removeEventListener('popstate', this.onPopState);
    }

    onClickLink(e: MouseEvent, anchor: HTMLAnchorElement) {
        const { pathname } = new URL(anchor.href);
        const { section, id } = this.deriveStateFromPathname(pathname);
        const title = id === this.state.id ? this.state.title : undefined;
        const state = { section, id, title };
        this.setState(state);
        this.history({ ...this.state, ...state });
    }
    onPopState(event: PopStateEvent) {
        if (event && event.state) {
            this.setState(event.state);
            this.scrollTop();
        }
    }
    onChangeQuery(query: string) {
        if (query !== this.state.query) {
            const state = { query, results: undefined };
            this.setState(state);
            this.history({ ...this.state, ...state }, true);
        }
    }
    onFetchResults(results: Results) {
        this.setState({ results });
        this.history({ ...this.state, results }, true);
    }
    onFetchTitle(title: Title) {
        this.setState({ title });
        this.history({ ...this.state, title }, true);
    }

    deriveStateFromPathname(pathname: string) {
        const [, section, id] = pathname.match(ROUTE_REGEX) as [string, 'movies' | 'tvshows', string];
        return { section, id: id && parseInt(id, 10) };
    }
    getPageHref(query: string, section?: string, id?: number) {
        const search = query ? `query=${encodeURIComponent(query)}` : '';
        if (section && id) return `/${section}/${id}${search}`;
        if (section) return `/${section}${search}`;
        return `/${search}`;
    }

    history(state: State, replace = false) {
        window.history[replace ? 'replaceState' : 'pushState'](
            state,
            document.title,
            this.getPageHref(state.query, state.section, state.id),
        );
        if (!replace) this.scrollTop();
    }
    scrollTop() {
        // TODO: scroll <Main /> to top
    }

    render() {
        return (
            <ClickHijacker onClickLink={this.onClickLink}>
                <DataFetcher onFetchResults={this.onFetchResults} onFetchTitle={this.onFetchTitle} {...this.state} />
            </ClickHijacker>
        );
    }
}
