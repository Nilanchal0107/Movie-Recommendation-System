import { apiRequest } from './client'

export type SessionMediaType = 'movie' | 'series' | 'either'
export type TimeLimit =
  | 'under_90'
  | '90_120'
  | '2_2.5'
  | 'no_limit'
  | 'episode_or_two'
  | 'binge'
  | 'new_show'
export type Occasion = 'friends_hangout' | 'date_night' | 'family_time' | 'solo_chill'

export interface SessionStartInput {
  mediaType: SessionMediaType
  groupSize: number
  timeLimit: TimeLimit
  occasion?: Occasion | null
}

export function startSession(input: SessionStartInput) {
  return apiRequest<{ sessionId: number }>('/sessions/start', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
