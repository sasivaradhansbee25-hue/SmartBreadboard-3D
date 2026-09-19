/**
 * SmartBreadboard 3D — Real-Time AR Coordinate Transformation Engine
 * Phase 8 Real-Time AR Overlay
 *
 * Provides:
 * - Precise screen aspect ratio & object-fit letterbox calculation
 * - Camera image pixel to screen/canvas coordinate mapping
 * - Physical component anchor calculation (midpoint of leads / component center)
 * - Perspective homography transformation
 * - Temporal smoothing for AR transformation matrices
 */

/**
 * Calculates the exact rendered rectangle and scale of the <video> element
 * inside its container accounting for CSS object-fit ('contain' | 'cover').
 *
 * @param {number} containerWidth - clientWidth of container
 * @param {number} containerHeight - clientHeight of container
 * @param {number} videoWidth - native videoWidth (e.g. 1280)
 * @param {number} videoHeight - native videoHeight (e.g. 720)
 * @param {'contain'|'cover'} objectFit - CSS object-fit mode
 * @returns {{xOffset: number, yOffset: number, displayedWidth: number, displayedHeight: number, scaleX: number, scaleY: number, videoWidth: number, videoHeight: number}}
 */
export function calculateVideoDisplayRect(
  containerWidth,
  containerHeight,
  videoWidth = 1280,
  videoHeight = 720,
  objectFit = 'contain'
) {
  const cw = Math.max(containerWidth || 800, 100);
  const ch = Math.max(containerHeight || 600, 100);
  const vw = Math.max(videoWidth || 1280, 1);
  const vh = Math.max(videoHeight || 720, 1);

  const containerAspect = cw / ch;
  const videoAspect = vw / vh;

  let displayedWidth = cw;
  let displayedHeight = ch;
  let xOffset = 0;
  let yOffset = 0;

  if (objectFit === 'contain') {
    if (containerAspect > videoAspect) {
      // Container is wider than video -> pillarboxed (black bars on left/right)
      displayedHeight = ch;
      displayedWidth = ch * videoAspect;
      xOffset = (cw - displayedWidth) / 2.0;
      yOffset = 0;
    } else {
      // Container is taller than video -> letterboxed (black bars on top/bottom)
      displayedWidth = cw;
      displayedHeight = cw / videoAspect;
      xOffset = 0;
      yOffset = (ch - displayedHeight) / 2.0;
    }
  } else if (objectFit === 'cover') {
    if (containerAspect > videoAspect) {
      displayedWidth = cw;
      displayedHeight = cw / videoAspect;
      xOffset = 0;
      yOffset = (ch - displayedHeight) / 2.0;
    } else {
      displayedHeight = ch;
      displayedWidth = ch * videoAspect;
      xOffset = (cw - displayedWidth) / 2.0;
      yOffset = 0;
    }
  }

  return {
    xOffset,
    yOffset,
    displayedWidth,
    displayedHeight,
    scaleX: displayedWidth / vw,
    scaleY: displayedHeight / vh,
    videoWidth: vw,
    videoHeight: vh
  };
}

/**
 * Transforms a camera image pixel [x, y] to screen/overlay canvas coordinates.
 *
 * @param {number} cameraX - X coordinate in camera image pixels (0..videoWidth)
 * @param {number} cameraY - Y coordinate in camera image pixels (0..videoHeight)
 * @param {ReturnType<typeof calculateVideoDisplayRect>} displayRect
 * @returns {{x: number, y: number}}
 */
export function cameraPixelToScreenCoord(cameraX, cameraY, displayRect) {
  if (!displayRect) {
    return { x: cameraX, y: cameraY };
  }
  const x = displayRect.xOffset + (cameraX * displayRect.scaleX);
  const y = displayRect.yOffset + (cameraY * displayRect.scaleY);
  return { x, y };
}

/**
 * Inverts screen coordinates [x, y] back to camera image pixels.
 * Used for tap-to-select raycasting on the AR canvas.
 *
 * @param {number} screenX - X coordinate on screen/canvas
 * @param {number} screenY - Y coordinate on screen/canvas
 * @param {ReturnType<typeof calculateVideoDisplayRect>} displayRect
 * @returns {{x: number, y: number}}
 */
export function screenCoordToCameraPixel(screenX, screenY, displayRect) {
  if (!displayRect || displayRect.scaleX === 0 || displayRect.scaleY === 0) {
    return { x: screenX, y: screenY };
  }
  const x = (screenX - displayRect.xOffset) / displayRect.scaleX;
  const y = (screenY - displayRect.yOffset) / displayRect.scaleY;
  return { x, y };
}

/**
 * Computes the physical screen anchor position for a tracked component.
 *
 * Priority:
 * 1. Midpoint of physical lead terminals [t1_img, t2_img]
 * 2. Center of tracked bounding box [bbox]
 * 3. Default fallback
 *
 * @param {Object} component - Tracked component object
 * @param {ReturnType<typeof calculateVideoDisplayRect>} displayRect
 * @returns {{anchorScreen: {x: number, y: number}, labelScreen: {x: number, y: number}, t1Screen: {x: number, y: number}|null, t2Screen: {x: number, y: number}|null}}
 */
export function calculateComponentAnchor(component, displayRect) {
  let cx = 0;
  let cy = 0;
  let t1Screen = null;
  let t2Screen = null;

  if (component.t1_img && component.t2_img && Array.isArray(component.t1_img) && Array.isArray(component.t2_img)) {
    cx = (component.t1_img[0] + component.t2_img[0]) / 2.0;
    cy = (component.t1_img[1] + component.t2_img[1]) / 2.0;
    t1Screen = cameraPixelToScreenCoord(component.t1_img[0], component.t1_img[1], displayRect);
    t2Screen = cameraPixelToScreenCoord(component.t2_img[0], component.t2_img[1], displayRect);
  } else if (component.center_x !== undefined && component.center_y !== undefined) {
    cx = component.center_x;
    cy = component.center_y;
  } else if (component.bbox || component.bbox_pixels) {
    const b = component.bbox || component.bbox_pixels;
    cx = (b[0] + b[2]) / 2.0;
    cy = (b[1] + b[3]) / 2.0;
  }

  const anchorScreen = cameraPixelToScreenCoord(cx, cy, displayRect);

  // Floating label position with upward vertical offset (60px above anchor)
  const labelScreen = {
    x: anchorScreen.x,
    y: Math.max(anchorScreen.y - 55, 30)
  };

  return {
    anchorScreen,
    labelScreen,
    t1Screen,
    t2Screen
  };
}

/**
 * Applies a 3x3 perspective homography matrix to a 2D point [x, y].
 *
 * @param {number[][]} H - 3x3 Homography Matrix
 * @param {number} x - Input X coordinate
 * @param {number} y - Input Y coordinate
 * @returns {{x: number, y: number}}
 */
export function transformHomographyPoint(H, x, y) {
  if (!H || H.length < 3 || H[0].length < 3) {
    return { x, y };
  }

  const denom = H[2][0] * x + H[2][1] * y + H[2][2];
  if (Math.abs(denom) < 1e-7) {
    return { x, y };
  }

  const px = (H[0][0] * x + H[0][1] * y + H[0][2]) / denom;
  const py = (H[1][0] * x + H[1][1] * y + H[1][2]) / denom;

  return { x: px, y: py };
}

/**
 * Smooths homography matrix coefficients across frames using Exponential Moving Average.
 *
 * @param {number[][]} currentH
 * @param {number[][]} previousH
 * @param {number} alpha
 * @returns {number[][]}
 */
export function smoothHomographyEMA(currentH, previousH, alpha = 0.65) {
  if (!previousH || previousH.length < 3) return currentH;
  if (!currentH || currentH.length < 3) return previousH;

  const smoothed = [];
  for (let r = 0; r < 3; r++) {
    smoothed[r] = [];
    for (let c = 0; c < 3; c++) {
      smoothed[r][c] = alpha * currentH[r][c] + (1.0 - alpha) * previousH[r][c];
    }
  }
  return smoothed;
}
