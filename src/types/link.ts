// Types for Link entity
export interface LinkMetadata {
  title: string;
  description: string;
  thumbnail_image: string;
  site_name: string;
  favicon: string;
}

export type MediaType = 'video' | 'image' | 'article';

export interface Link {
  _id: string;
  original_url: string;
  metadata: LinkMetadata;
  tags: string[];
  media_type: MediaType;
  is_favorite: boolean;
  created_at: Date;
}

export interface CreateLinkInput {
  original_url: string;
  metadata?: Partial<LinkMetadata>;
  tags?: string[];
  media_type?: MediaType;
  is_favorite?: boolean;
}
