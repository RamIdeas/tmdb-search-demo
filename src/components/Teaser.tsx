import React from 'react';
import styled from 'styled-components';
import { TitleSummary } from '../types';
import GenreList from './GenreList';

const Outer = styled.a`
    padding: 0.5rem;
    background-color: white;
    text-decoration: none;

    display: grid;
    grid-gap: 0.5rem;
    grid-template-areas:
        'image heading'
        'image genres';
    grid-template-columns: 2rem 1fr;
`;

const Image = styled.div`
    grid-area: image;
    height: 100%;
    width: 100%;
    background: url("${props => props.posterUrl}") no-repeat center center / contain;
`;

const Heading = styled.header`
    grid-area: heading;
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
    color: #222;
`;

const StyledGenreList = styled(GenreList)`
    grid-area: genres;
`;

interface Props {
    section: 'movies' | 'tvshows';
    title: TitleSummary;
    query: string;
    getUrl(query: string, section?: 'movies' | 'tvshows', id?: number): string;
}

const TitleTeaser = ({ section, title, query, getUrl }: Props) => (
    <Outer href={getUrl(query, section, title.id)}>
        <Image posterUrl={title.posterUrl} title={`Poster for ${title.name}`} />
        <Heading>{title.name}</Heading>
        <StyledGenreList genres={title.genres} />
    </Outer>
);

export default TitleTeaser;
