export const buildQuery = (params) =>
  new URLSearchParams({
    seed: params.seed,
    lang: params.lang,
    page: params.page,
    pageSize: params.pageSize,
    likes: params.likesAverage,
    likedSongId: params.likedSongId,
  }).toString();