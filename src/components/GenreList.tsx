import React from 'react';
import styled from 'styled-components';

const Outer = styled.div`
    display: grid;
    grid-gap: 0.5rem;
    grid-auto-flow: column;
    grid-auto-columns: fit-content(50ch);
`;
const Genre = styled.span`
    display: inline-block;
    background-color: #eee;
    border-radius: 0.5rem;
    color: #666;
    padding: 0.2rem 0.6rem;
    font-size: 0.7rem;
`;

interface Props {
    genres: string[];
}

const GenreList = ({ genres, ...props }: Props) =>
    genres.length === 0 ? null : <Outer {...props}>{genres.map((genre, i) => <Genre key={i}>{genre}</Genre>)}</Outer>;

export default GenreList;
