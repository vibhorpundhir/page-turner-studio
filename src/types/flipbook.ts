export interface FlipbookPage {
  id: string;
  imageUrl: string;
  order: number;
}

export interface Flipbook {
  id: string;
  title: string;
  description: string;
  fps: number;
  pages: FlipbookPage[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlipbookState {
  flipbooks: Flipbook[];
  currentFlipbook: Flipbook | null;
  currentPage: number;
  isPlaying: boolean;
  fps: number;
}
