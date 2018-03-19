import React from 'react';
import styled, { css } from 'styled-components';
import { Title } from '../types';
import GenreList from './GenreList';

const PANEL_WIDTH = 25;
const MIN_PANEL_WIDTH = 20;

const Outer = styled.div`
    background: url("${(props: Partial<Title>) => props.backdropUrl}") no-repeat center center / cover;
    position: relative; > * { z-index: 1; }
    &:before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; bottom: 0;
        background-color: rgba(255,255,255, 0.5);
        z-index: 0;
    }

    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow-y: scroll;
    overflow-x: hidden;
`;

const Inner = styled.div`
    width: calc(100% - 2rem);
    max-width: ${PANEL_WIDTH}rem;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 1rem;
    margin: 1rem;

    display: grid;
    grid-gap: 1rem;
    justify-items: center;
`;

const Image = styled.img`
    max-width: 10rem;
`;
const Heading = styled.div`
    font-size: 1.2rem;
    line-height: 1.5;
    margin: 0;
    color: #222;
`;
const Overview = styled.p`
    width: 100%;
    margin: 0;
    color: #444;
`;

interface Props {
    title: Title;
}

const Panel = ({ title, ...props }: Props) => (
    <Outer {...props} backdropUrl={title && title.backdropUrl}>
        {title && (
            <Inner>
                <Image src={title.posterUrl} alt={`Poster for ${title.name}`} />
                <Heading>{title.name}</Heading>
                <GenreList genres={title.genres} />
                <Overview>{title.overview}</Overview>
            </Inner>
        )}
    </Outer>
);

export default Panel;
