export interface User {
  id: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  created_at: string;
}

export interface ComicPanel {
  url: string;
  prompt: string;
  panel_number: number;
}

export interface Story {
  id: string;
  project_id: string;
  narrative_text: string;
  comic_panels: ComicPanel[];
  audio_url?: string;
  tone: string;
  format: string;
  num_panels: number;
  engagement_score: number;
  created_at: string;
}

export interface GenerateStoryRequest {
  project_id: string;
  time_range: string;
  tone: string;
  format: string;
  include_comics: boolean;
  num_panels: number;
}