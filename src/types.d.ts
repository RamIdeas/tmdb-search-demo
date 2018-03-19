export interface TitleSummary {
    id: number;
    name: string;
    genres: string[];
    posterUrl: string;
}

export interface Title extends TitleSummary {
    overview: string;
    backdropUrl: string;
}

export type Results = { movies: TitleSummary[]; tvshows: TitleSummary[] };
