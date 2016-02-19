export function youtubeId(id) {
  let yId = (id.split('/')).pop();
  if (yId.includes('watch?v=')) {
    yId = yId.split('watch?v=').pop();
  }
  return yId;
}
