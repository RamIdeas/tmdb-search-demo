import React from 'react';
import { Title, Results, Focus } from '../types';
import { ClickHijacker } from './ClickHijacker';
import Page from './Page';

interface Props {
    section?: 'movies' | 'tvshows';
    id?: number;
    focus: Focus;
    query: string;
    results: Results;
    title: Title;

    onChangeQuery(query: string);
    getPageHref(query: string, section?: string, id?: number);
    onFetchResults(results: Results);
    onFetchTitle(title: Title);
}

interface State {
    results: Results;
    title: Title;
}

export default class AppDataFetcher extends React.Component<Props, State> {
    state = {
        results: undefined,
        title: undefined,
    };

    componentWillReceiveProps(nextProps: Props, nextState: State) {
        if (nextProps.query !== this.props.query) {
            if (!nextProps.results) {
                const loading = !!this.state.results;
                if (!loading) this.setState({ results: this.props.results });

                const { query } = nextProps;

                fetch(`/api/search/${query}`)
                    .then(res => res.json())
                    .then(results => {
                        this.setState({ results: undefined });
                        this.props.onFetchResults(results);
                    });
            } else if (nextProps.results !== this.props.results) {
                this.setState({ results: undefined });
            }
        }

        if (nextProps.section !== this.props.section || nextProps.id !== this.props.id) {
            if (!nextProps.title) {
                const loading = !!this.state.title;
                if (!loading) this.setState({ title: this.props.title });

                const { section, id } = nextProps;
                const resource = section.slice(0, -1);

                fetch(`/api/${resource}/${id}`)
                    .then(res => res.json())
                    .then(title => {
                        this.setState({ title: undefined });
                        this.props.onFetchTitle(title);
                    });
            } else if (nextProps.title !== this.props.title) {
                this.setState({ title: undefined });
            }
        }
    }

    render() {
        const { focus, query, getPageHref, onChangeQuery } = this.props;
        let { results, title } = this.state;

        if (results === undefined) results = this.props.results;
        if (title === undefined) title = this.props.title;

        const { movies, tvshows } = results || ({} as Results);

        return <Page {...{ focus, query, movies, tvshows, title, getUrl: getPageHref, onChangeQuery }} />;
    }
}
