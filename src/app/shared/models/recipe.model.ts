export interface Recipe {
  name: string;
  thumbnail_url: string;
  description: string;
  original_video_url: string;
  [k: string]: any;
}