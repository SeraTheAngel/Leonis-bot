const API = 'https://api.waifu.pics/sfw';

export async function getAnimeGif(type) {
  const response = await fetch(`${API}/${encodeURIComponent(type)}`);
  if (!response.ok) throw new Error(`GIF API returned ${response.status}`);
  const data = await response.json();
  if (!data.url) throw new Error('GIF API returned no URL');
  return data.url;
}
