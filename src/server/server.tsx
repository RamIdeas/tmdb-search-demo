import { createServer } from 'http';
import url from 'url';
import { createReadStream } from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import api from './api';
import { Title, TitleSummary } from '../types';
import Page from '../components/Page';

// regex's use `+` to prevent undefined parameters
const ROUTES = {
    index: /^\/(?:(movies|tvshows)(?:\/(\d+))?)?$/,
    search: /^\/api\/search\/(.+)$/,
    title: /^\/api\/(movie|tvshow)\/(\d+)$/,
};

const selectedRegex = /^(movie|tvshow)-(\d+)$/;

export const server = createServer(async (req, res) => {
    const { pathname, query } = url.parse(req.url, true);

    if (pathname === '/client.js') {
        res.statusCode = 200;
        res.setHeader('content-type', 'application/javascript');
        createReadStream('./build/client.js').pipe(res);
    } else if (ROUTES.index.test(pathname)) {
        const [, section, id] = pathname.match(ROUTES.index);
        const { q } = query;

        const html = await getHtml(q && q.toString(), section, id && parseInt(id, 10));

        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        res.end(html);
    } else if (ROUTES.search.test(pathname)) {
        const [, q] = pathname.match(ROUTES.search);
        const { page } = query;

        const results = getSearchResults(q, page && parseInt(page.toString(), 10));
        const json = JSON.stringify(results);

        res.statusCode = 200;
        res.setHeader('content-type', 'text/json');
        res.end(json);
    } else if (ROUTES.title.test(pathname)) {
        const [, type, id] = pathname.match(ROUTES.title);

        const title = await getSelectedTitle(type, parseInt(id, 10));
        const json = JSON.stringify(title);

        res.statusCode = 200;
        res.setHeader('content-type', 'text/json');
        res.end(json);
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

const hasSelected = (selected: string | string[]) => selected && selectedRegex.test(selected.toString());

const getSelectedTitle = (type: string, id: number) => {
    const get = type.startsWith('movie') ? api.get.movie : api.get.tvshow;
    return get(id);
};

const scriptTagJSON = (js: object): string => JSON.stringify(js).replace(/<\/script>/gi, '<\\/script>');

const getHtml = async (query: string, section: string, id: number | undefined) => {
    const movies = query ? api.search.movies(query) : ([] as TitleSummary[]);
    const tvshows = query ? api.search.tvshows(query) : ([] as TitleSummary[]);
    const title = id && getSelectedTitle(section, id);

    const props = {
        movies: await movies,
        tvshows: await tvshows,
        title: await title,
        focus: {
            movies: section !== 'tvshows',
            tvshows: section !== 'movies',
            title: !!id,
        },
        query,
        getUrl: (query: string, section?: string, id?: number) => {
            const parts = ['/', section, section && id && '/' + id, query && `?q=${query}`];
            return parts.filter(Boolean).join('');
        },
    };
    const component = <Page {...props} />;
    const sheet = new ServerStyleSheet();
    const content = renderToString(sheet.collectStyles(component));
    const styles = sheet.getStyleTags();

    const html = `
        <!doctype html>
        <html lang="en-GB">
            <head>
                <script defer src="/client.js"></script>
                <style>* { box-sizing: border-box; } html, body { height: 100%; margin: 0; }</style>
                ${styles}
            </head>
            <body>
                <div id="app">${content}</div>

                <script>
                    window.__PROPS__ = ${scriptTagJSON(props)};
                </script>
            </body>
        </html>`;

    return html;
};

const getSearchResults = async (query: string, page: number | undefined) => {
    const movies = api.search.movies(query, page);
    const tvshows = api.search.tvshows(query, page);

    const results = { movies: await movies, tvshows: await tvshows };

    return results;
};
