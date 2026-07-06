/**
 * @param {{
 *   containerBottom: number;
 *   containerTop: number;
 *   itemBottom: number;
 *   itemTop: number;
 * }} bounds
 */
export function getScrollDeltaToKeepItemVisible({
  containerBottom,
  containerTop,
  itemBottom,
  itemTop,
}) {
  if (itemTop < containerTop) {
    return itemTop - containerTop;
  }

  if (itemBottom > containerBottom) {
    return itemBottom - containerBottom;
  }

  return 0;
}

/**
 * @param {{
 *   clientHeight: number;
 *   overflowY: string;
 *   scrollHeight: number;
 * }} scrollState
 */
export function canScrollContainer({ clientHeight, overflowY, scrollHeight }) {
  return (
    (overflowY === "auto" || overflowY === "scroll") &&
    scrollHeight > clientHeight
  );
}
