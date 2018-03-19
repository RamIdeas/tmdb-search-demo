import fetch from 'node-fetch';
import { TMDB_API_KEY } from './keys';
import { Title, TitleSummary } from '../types';

interface Query {
    [key: string]: any;
}
interface ApiGet {
    (path: '/genre/movie/list', query?: Query): Promise<GenreResponse>;
    (path: '/genre/tv/list', query?: Query): Promise<GenreResponse>;
    (path: '/search/movie', query: Query & { query: string }): Promise<ListResponse<Movie>>;
    (path: '/search/tv', query: Query & { query: string }): Promise<ListResponse<TVShow>>;
    (path: '/search/tv', query?: Query): Promise<TVShow[]>;
    // (path: '/movie/:id', query?: Query): Promise<Movie>;
    // (path: '/tv/:id', query?: Query): Promise<TVShow>;
    (path: string, query?: Query): Promise<any>;
}
interface Movie {
    id: number;
    title: string;
    overview: string;
    genre_ids?: number[];
    genres?: { id: number; name: string }[];
    poster_path: string;
    backdrop_path: string;
}
interface TVShow {
    id: number;
    name: string;
    overview: string;
    genre_ids?: number[];
    genres?: { id: number; name: string }[];
    poster_path: string;
    backdrop_path: string;
}
interface Genre {
    id: number;
    name: string;
}
type GenreResponse = { genres: Genre[] };
type ListResponse<T> = {
    page: number;
    total_results: number;
    total_pages: number;
    results: T[];
};

const qs = (query: object) =>
    Object.entries(query)
        .map(pair => pair.map(encodeURIComponent).join('='))
        .join('&');

const get: ApiGet = (path: string, query: Query = {}) => {
    query = { api_key: TMDB_API_KEY, ...query };
    return fetch(`https://api.themoviedb.org/3${path}?${qs(query)}`).then(res => res.json());
};

const transformGenreList = (x: GenreResponse) =>
    new Map(x.genres.map(({ id, name }) => [id, name] as [number, string]));
const movieGenreMap = get('/genre/movie/list').then(transformGenreList);
const tvshowGenreMap = get('/genre/tv/list').then(transformGenreList);

const transformMovie = async (movie: Movie): Promise<Title> => {
    const { id, title, overview, genre_ids, genres, poster_path, backdrop_path } = movie;
    const genreMap = await tvshowGenreMap;
    const genrelist = genre_ids
        ? genre_ids.map((id: number) => genreMap.get(id)).filter(Boolean)
        : genres.map(({ name }) => name);
    const posterUrl = `https://image.tmdb.org/t/p/w154/${poster_path}`;
    const backdropUrl = `https://image.tmdb.org/t/p/w780/${backdrop_path}`;
    return { id, name: title, overview, genres: genrelist, posterUrl, backdropUrl };
};
const transformTVShow = async (tvshow: TVShow): Promise<Title> => {
    const { id, name, overview, genre_ids, genres, poster_path, backdrop_path } = tvshow;
    const genreMap = await movieGenreMap;
    const genrelist = genre_ids
        ? genre_ids.map((id: number) => genreMap.get(id)).filter(Boolean)
        : genres.map(({ name }) => name);
    const posterUrl = `https://image.tmdb.org/t/p/w154/${poster_path}`;
    const backdropUrl = `https://image.tmdb.org/t/p/w780/${backdrop_path}`;
    return { id, name, overview, genres: genrelist, posterUrl, backdropUrl };
};
const summariseTitle = ({ overview, backdropUrl, ...summary }: Title): TitleSummary => summary;

export default {
    search: {
        movies: async (query: string, page = 1) => {
            const res = await get('/search/movie', { query, page });
            const titles = await Promise.all(res.results.map(transformMovie));
            return titles.map(summariseTitle);
        },
        tvshows: async (query: string, page = 1) => {
            const res = await get('/search/tv', { query, page });
            const titles = await Promise.all(res.results.map(transformTVShow));
            return titles.map(summariseTitle);
        },
    },
    get: {
        movie: (id: number) => get(`/movie/${id}`).then(transformMovie),
        tvshow: (id: number) => get(`/tv/${id}`).then(transformTVShow),
    },
};
