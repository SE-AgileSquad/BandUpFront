export interface IBWord {
  word: string;
  start: number;
  end: number;
  score: number;
  pos?: string;
}

export interface IBSegment {
  id: string;
  text: string;
  start: number;
  end: number;
  words: IBWord[];
  translation_fa?: string;
  translation_es?: string | null;
}

export interface IBPage {
  id: string;
  pageNumber: number;
  title?: string;
  audioUrl: string;
  segments: IBSegment[];
}

// Flattened word, tagged with its position — used everywhere we need
// a single linear index into "all words on the page" (or, for video,
// "all words in the transcript").
export interface FlatWord extends IBWord {
  segmentIndex: number;
  wordIndex: number;
  globalIndex: number;
}

// Shared core: works on anything shaped like `{ words: IBWord[] }[]`,
// so both IBPage.segments and VideoDetail.segments can use it.
function flattenWordsFromSegments<S extends { words: IBWord[] }>(
  segments: S[]
): FlatWord[] {
  const flat: FlatWord[] = [];
  let globalIndex = 0;
  segments.forEach((seg, segmentIndex) => {
    seg.words.forEach((w, wordIndex) => {
      flat.push({ ...w, segmentIndex, wordIndex, globalIndex });
      globalIndex++;
    });
  });
  return flat;
}

export function flattenWords(page: IBPage): FlatWord[] {
  return flattenWordsFromSegments(page.segments);
}

export interface IBPageManifestEntry {
  pageNumber: number;
  path: string;
  title?: string;
}

export interface IBPageManifest {
  pages: IBPageManifestEntry[];
}

export interface SavedWord {
  id: string;
  word: string;
  cleanedWord: string;
  pageId: string;
  pageNumber: number;
  pageTitle?: string;
  segmentIndex: number;
  wordIndex: number;
  globalIndex: number;
  start: number;
  end: number;
  savedAt: number;
}

// ===== Videos =====

// POST /api/v1/videos/upload  → data: VideoSummary
// GET  /api/v1/videos/:id/status → data: VideoSummary
// GET  /api/v1/videos          → data: VideoSummary[]
export type VideoStatus = "pending" | "processing" | "done" | "failed"; // ⚠️ confirm no other values exist

export interface VideoSummary {
  id: number;
  status: VideoStatus;
  originalFilename: string;
  thumbnailUrl: string;
  errorMessage: string | null;
}

// ===== Auth tokens =====
// POST /api/v1/auth/login  → data: LoginResponseData
// POST /api/v1/auth/refresh → data: LoginResponseData (⚠️ assumed same shape)
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
}

// GET /api/v1/videos/:id → data: VideoDetail
// Word shape is identical to IBWord — reused rather than redefined.
// ⚠️ translation_fa only ever seen present with a value — kept optional to be safe.
export interface VideoSegment {
  start: number;
  end: number;
  text: string;
  words: IBWord[];
  avg_logprob: number;
  translation_fa?: string;
  translation_es?: string;
}

export interface VideoDetail {
  segments: VideoSegment[];
  audioUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  id: number;
}

export function flattenVideoWords(segments: VideoSegment[]): FlatWord[] {
  return flattenWordsFromSegments(segments);
}

export interface Book {
  id: number;
  slug: string;
  title: string;
  author: string;
}

export interface BookPagesResponse {
  pages: string[]; // e.g. "Page_99"
}

export interface BookPage {
  id: string; // "Page_99"
  title?: string;
  pageNumber: string; // comes as a string from the API
  audioUrl: string; // relative path
  segments: BookSegment[];
}

export interface BookSegment {
  start: number;
  end: number;
  text: string;
  words: IBWord[];
  avg_logprob: number;
  translation_fa?: string;
  translation_es?: string | null;
}

export type TranslationLanguage = "fa" | "es";