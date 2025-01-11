export enum Genre {
  'Hip-Hop' = 'Hip-Hop',
  'Pop' = 'Pop',
  'Popular Music' = 'Popular Music',
  'Rock' = 'Rock',
  'Rhythm & Blues' = 'Rhythm & Blues',
  'Country' = 'Country',
  'Electronic' = 'Electronic',
  'Jazz' = 'Jazz',
  'Soul' = 'Soul',
  'Heavy metal' = 'Heavy metal',
  'R&B' = 'R&B',
}

export enum TimeOfDay {
  'Early Morning' = 'Early Morning',
  'Morning' = 'Morning',
  'Afternoon' = 'Afternoon',
  'Evening' = 'Evening',
  'Night' = 'Night',
  'Midnight' = 'Midnight',
}

export enum Mood {
  'Energetic' = 'Energetic',
  'Mellow' = 'Mellow',
  'Motivational' = 'Motivational',
  'Happy' = 'Happy',
  'Sad' = 'Sad',
  'Enigmatic' = 'Enigmatic',
  'Dark' = 'Dark',
  'Scary' = 'Scary',
}

export enum Activity {
  'Workout' = 'Workout',
  'Relaxation' = 'Relaxation',
  'Study' = 'Study',
  'Driving' = 'Driving',
  'Party' = 'Party',
}

export type Parameters = {
  genre: Genre;
  timeOfDay: TimeOfDay;
  mood: Mood;
  activity: Activity;
};
