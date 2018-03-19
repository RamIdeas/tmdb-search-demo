import React from 'react';
import styled, { css } from 'styled-components';
import { TitleSummary, Focus, Title } from '../types';
import TitleTeaser from './Teaser';
import Panel from './Panel';
import ThrottledInput from './ThrottledInput';

const EPSILON = 0.00001;
const PANEL_WIDTH = 25;
const MIN_PANEL_WIDTH = 20;
const MOBILE_VIEWPORT = MIN_PANEL_WIDTH * 2;
const TABLET_VIEWPORT = MIN_PANEL_WIDTH * 3;

const mobile = (s, ...i) => css`
    @media (max-width: ${MOBILE_VIEWPORT}rem) {
        ${css(s, ...i)};
    }
`;
const tablet = (s, ...i) => css`
    @media (max-width: ${TABLET_VIEWPORT}rem) {
        ${css(s, ...i)};
    }
`;

const mainFocus = (focused: any, unfocused: any) =>
    function({ focus, section }: FocusProps) {
        if (section === 'movies') return focus.movies ? focused : unfocused;
        if (section === 'tvshows') return focus.tvshows && (focus.title && !focus.movies) ? focused : unfocused;
    };

const Outer = styled.div`
    * {
        font-family: 'Helvetica Neue', 'Segoe UI';
    }
    height: 100vh;

    display: flex;
`;

const Main = styled.div`
    flex: 2 1 0;
    overflow: hidden;
    transition: flex-grow 0.4s ease-in-out;

    ${tablet`
        flex-grow: 1;
    `};
    ${mobile`
        flex-grow: ${({ focus }: FocusProps) => (!focus.title ? 1 : EPSILON)};
    `};

    display: flex;
    flex-direction: column;
`;
const SelectedPanel = styled(Panel)`
    flex: 1 1 0;
    flex-grow: ${({ focus }: FocusProps) => (focus.title ? 1 : EPSILON)};
    transition: flex-grow 0.4s ease-in-out;
    overflow: hidden;
`;
const SelectedTitle = styled.div`
    width: 100%;
    max-width: ${PANEL_WIDTH}rem;
    min-width: ${MIN_PANEL_WIDTH}rem;
`;
const Search = styled.div`
    height: 8rem;
    background-color: #bbb;

    display: flex;
    justify-content: center;
    align-items: center;
`;
const SearchInput = styled(ThrottledInput)`
    width: 30rem;
    max-width: calc(100% - 2.5rem);
    font-size: 1.5rem;
    padding: 0.5rem 1rem;

    ${mobile`
        font-size: 1rem;
    `};
`;
const HeaderRow = styled.nav`
    display: flex;
`;
const Header = styled.a`
    flex: 1 0 12ch;
    text-align: center;
    padding: 1rem;
    background-color: #eee;
    color: #222;
    text-decoration: none;
    transition: flex-grow 0.4s ease-in-out;

    ${mobile`
        flex-grow: ${mainFocus(1, EPSILON)};
        > span { transform: scale(${mainFocus(1, 0.8)}); }
    `};
    ${tablet`
        flex-grow: ${(props: FocusProps) => (props.focus.title ? mainFocus(1, EPSILON)(props) : undefined)};
    `};

    > span {
        display: block;
        transition: transform 0.4s ease-in-out;
    }

    &:last-child {
        margin-left: 0.25rem;
    }
`;
const TitleListRow = styled.div`
    flex: 1;
    display: flex;
    background-color: #ddd;
    overflow-y: scroll;
    overflow-x: hidden;
`;
const TitleListColumn = styled.div`
    flex: 1 1 0;
    min-height: min-content;
    transition: flex-grow 0.4s ease-in-out;
    overflow-x: hidden;

    ${mobile`
        flex-grow: ${mainFocus(1, EPSILON)};
    `};
    ${tablet`
        flex-grow: ${(props: FocusProps) => (props.focus.title ? mainFocus(1, EPSILON)(props) : undefined)};
    `};
`;
const TitleList = styled.ul`
    width: 100%;
    height: 100%;
    min-width: ${MIN_PANEL_WIDTH}rem;
    padding: 0.5rem;
    margin: 0;

    display: grid;
    grid-gap: 0.5rem;
`;

interface Props {
    section?: 'movies' | 'tvshows';
    id?: number;
    focus: Focus;
    query?: string;
    movies?: TitleSummary[];
    tvshows?: TitleSummary[];
    title?: Title;
    getUrl(query: string, section?: 'movies' | 'tvshows', id?: number): string;
    onChangeQuery(query: string);
}

interface FocusProps {
    focus: Focus;
    section: 'movies' | 'tvshows' | 'title';
}

export default ({ query, movies, tvshows, title, focus, getUrl, onChangeQuery, ...props }: Props) => (
    <Outer {...props}>
        <Main focus={focus}>
            <Search>
                <SearchInput onChange={onChangeQuery} placeholder="Search for a movie or TV show..." />
            </Search>
            <HeaderRow>
                <Header href={getUrl(query, 'movies')} focus={focus} section="movies">
                    <span>Movies</span>
                </Header>
                <Header href={getUrl(query, 'tvshows')} focus={focus} section="tvshows">
                    <span>TV Shows</span>
                </Header>
            </HeaderRow>
            <TitleListRow>
                <TitleListColumn focus={focus} section="movies">
                    <TitleList>
                        {movies.map(title => (
                            <TitleTeaser key={title.id} section="movies" title={title} query={query} getUrl={getUrl} />
                        ))}
                    </TitleList>
                </TitleListColumn>
                <TitleListColumn focus={focus} section="tvshows">
                    <TitleList>
                        {tvshows.map(title => (
                            <TitleTeaser key={title.id} section="tvshows" title={title} query={query} getUrl={getUrl} />
                        ))}
                    </TitleList>
                </TitleListColumn>
            </TitleListRow>
        </Main>
        <SelectedPanel focus={focus} section="title" title={title} />
    </Outer>
);
