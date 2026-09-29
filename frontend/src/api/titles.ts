import { apiRequest } from './client'

export const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w92'

export interface TitleSearchResult {
  id: number
  tmdbId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  releaseDate: string | null
}

export function searchTitles(query: string, mediaType: 'movie' | 'tv') {
  return apiRequest<{ results: TitleSearchResult[] }>('/titles/search', {
    method: 'POST',
    body: JSON.stringify({ query, mediaType }),
  })
}
