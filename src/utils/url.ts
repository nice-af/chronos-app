/**
 * Parses the query parameters from a URL and returns them as an object.
 */
export function getUrlParams(url: string) {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  let params: Record<string, string> = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
}
