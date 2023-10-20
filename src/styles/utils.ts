export function getPadding(a: number, b?: number, c?: number, d?: number) {
  return {
    paddingTop: a,
    paddingRight: b ?? a,
    paddingBottom: c ?? a,
    paddingLeft: d ?? b ?? a,
  };
}
