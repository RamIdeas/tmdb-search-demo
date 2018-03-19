import React from 'react';
import { Title, Results } from '../types';
import { ClickHijacker } from './ClickHijacker';

interface Props {
    section?: 'movies' | 'tvshows';
    id?: number;
    query: string;
    results: Results;
    title: Title;

    onFetchResults(results: Results): void;
    onFetchTitle(title: Title): void;
}

export default class AppDataFetcher extends React.Component<Props> {}
