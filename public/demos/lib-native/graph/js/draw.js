// draw.js

// Calculate the small grid increment based on scale
export function calculateSmallGridIncrement(scale, scaleLevels, scaleIndex) {
  const BASE_INCREMENT = 0.2;
  const BASE_SCALE = scaleLevels[0];
  return BASE_INCREMENT * (BASE_SCALE / scaleLevels[scaleIndex]);
}

// Calculate the large grid increment based on scale
export function calculateLargeGridIncrement(
  scale,
  scaleLevels,
  scaleIndex,
  tickMultipliers
) {
  const BASE_TICK_INCREMENT = 1;
  const BASE_SCALE = scaleLevels[0];
  return (
    BASE_TICK_INCREMENT *
    (BASE_SCALE / scaleLevels[scaleIndex]) *
    tickMultipliers[scaleIndex]
  );
}

// Calculate label value for ticks
export function calculateLabel(
  value,
  scaleLevels,
  scaleIndex,
  tickMultipliers
) {
  const BASE_SCALE = scaleLevels[0];
  return (
    value *
    (scaleLevels[scaleIndex] / BASE_SCALE) *
    tickMultipliers[scaleIndex]
  );
}

// Draw minor grid lines
export function drawMinorGrid(x0, x1, y0, y1, increment, worldToScreen) {
  let content = "";
  const buffer = increment;
  const gridX0 = Math.max(x0 - buffer, Math.ceil(x0 / increment) * increment);
  const gridX1 = Math.min(x1 + buffer, Math.floor(x1 / increment) * increment);
  const gridY0 = Math.max(y0 - buffer, Math.ceil(y0 / increment) * increment);
  const gridY1 = Math.min(y1 + buffer, Math.floor(y1 / increment) * increment);

  for (let gx = gridX0; gx <= gridX1 + increment / 2; gx += increment) {
    const [sx0, sy0] = worldToScreen(gx, y0);
    const [sx1, sy1] = worldToScreen(gx, y1);
    content += `<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#1f2937" stroke-width="0.4"/>`;
  }

  for (let gy = gridY0; gy <= gridY1 + increment / 2; gy += increment) {
    const [sx0, sy0] = worldToScreen(x0, gy);
    const [sx1, sy1] = worldToScreen(x1, gy);
    content += `<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#374151" stroke-width="0.4"/>`;
  }

  return content;
}

// Draw major grid lines
export function drawMajorGrid(x0, x1, y0, y1, increment, worldToScreen) {
  let content = "";
  const buffer = increment;
  const gridX0 = Math.max(x0 - buffer, Math.ceil(x0 / increment) * increment);
  const gridX1 = Math.min(x1 + buffer, Math.floor(x1 / increment) * increment);
  const gridY0 = Math.max(y0 - buffer, Math.ceil(y0 / increment) * increment);
  const gridY1 = Math.min(y1 + buffer, Math.floor(y1 / increment) * increment);

  for (let gx = gridX0; gx <= gridX1 + increment / 2; gx += increment) {
    const [sx0, sy0] = worldToScreen(gx, y0);
    const [sx1, sy1] = worldToScreen(gx, y1);
    content += `<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#4b5563" stroke-width="1"/>`;
  }

  for (let gy = gridY0; gy <= gridY1 + increment / 2; gy += increment) {
    const [sx0, sy0] = worldToScreen(x0, gy);
    const [sx1, sy1] = worldToScreen(x1, gy);
    content += `<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#6b7280" stroke-width="1"/>`;
  }

  return content;
}

// Draw main axes
export function drawAxes(
  x0,
  x1,
  y0,
  y1,
  worldToScreen,
  width,
  height,
  drawStickyAxes
) {
  let content = "";
  const [sxY0, syY0] = worldToScreen(0, y0);
  const [sxY1, syY1] = worldToScreen(0, y1);
  const [sxX0, syX0] = worldToScreen(x0, 0);
  const [sxX1, syX1] = worldToScreen(x1, 0);
  const xVisible = syX0 >= 0 && syX0 <= height;
  const yVisible = sxY0 >= 0 && sxY0 <= width;

  if (yVisible) {
    content += `<line x1="${sxY0}" y1="${syY0}" x2="${sxY1}" y2="${syY1}" stroke="white" stroke-width="1.5"/>`;
  }
  if (xVisible) {
    content += `<line x1="${sxX0}" y1="${syX0}" x2="${sxX1}" y2="${syX1}" stroke="white" stroke-width="1.5"/>`;
  }

  content += drawStickyAxes(x0, x1, y0, y1, xVisible, yVisible);
  return content;
}

// Draw sticky axes when main axes are off-screen
export function drawStickyAxes(
  x0,
  x1,
  y0,
  y1,
  xVisible,
  yVisible,
  worldToScreen,
  width,
  height,
  scale,
  scaleLevels,
  scaleIndex,
  tickMultipliers
) {
  let content = "";
  const tickIncrement = 1 * (scaleLevels[0] / scaleLevels[scaleIndex]);
  const [sxY0] = worldToScreen(0, y0);
  const [, syX0] = worldToScreen(x0, 0);

  if (!xVisible) {
    const yPos = syX0 < 0 ? 20 : height - 20;
    content += `<line x1="0" y1="${yPos}" x2="${width}" y2="${yPos}" stroke="white" stroke-dasharray="4" stroke-width="1.5"/>`;
    for (
      let gx = Math.ceil(x0 / tickIncrement) * tickIncrement;
      gx <= x1;
      gx += tickIncrement
    ) {
      const [sx] = worldToScreen(gx, 0);
      const label = calculateLabel(
        gx,
        scaleLevels,
        scaleIndex,
        tickMultipliers
      );
      content += `<text x="${sx}" y="${
        yPos - 5
      }" text-anchor="middle">${Math.round(label)}</text>`;
    }
  }

  if (!yVisible) {
    const xPos = sxY0 < 0 ? 40 : width - 40;
    content += `<line x1="${xPos}" y1="0" x2="${xPos}" y2="${height}" stroke="white" stroke-dasharray="4" stroke-width="1.5"/>`;
    for (
      let gy = Math.ceil(y0 / tickIncrement) * tickIncrement;
      gy <= y1;
      gy += tickIncrement
    ) {
      const [, sy] = worldToScreen(0, gy);
      const label = calculateLabel(
        gy,
        scaleLevels,
        scaleIndex,
        tickMultipliers
      );
      content += `<text x="${
        xPos - 5
      }" y="${sy}" text-anchor="end" dominant-baseline="middle">${Math.round(
        label
      )}</text>`;
    }
  }

  return content;
}

// Draw tick marks and labels
export function drawTicks(
  x0,
  x1,
  y0,
  y1,
  worldToScreen,
  scale,
  scaleLevels,
  scaleIndex,
  tickMultipliers,
  width,
  height
) {
  let content = "";
  const tickIncrement = 1 * (scaleLevels[0] / scaleLevels[scaleIndex]);
  const xVisible =
    worldToScreen(0, 0)[1] >= 0 && worldToScreen(0, 0)[1] <= height;
  const yVisible =
    worldToScreen(0, 0)[0] >= 0 && worldToScreen(0, 0)[0] <= width;

  if (xVisible) {
    for (
      let gx = Math.ceil(x0 / tickIncrement) * tickIncrement;
      gx <= x1;
      gx += tickIncrement
    ) {
      const [sx, sy] = worldToScreen(gx, 0);
      const label = calculateLabel(
        gx,
        scaleLevels,
        scaleIndex,
        tickMultipliers
      );
      content += `<text x="${sx + 2}" y="${
        sy - 2
      }" text-anchor="middle">${Math.round(label)}</text>`;
    }
  }

  if (yVisible) {
    for (
      let gy = Math.ceil(y0 / tickIncrement) * tickIncrement;
      gy <= y1;
      gy += tickIncrement
    ) {
      const [sx, sy] = worldToScreen(0, gy);
      const label = calculateLabel(
        gy,
        scaleLevels,
        scaleIndex,
        tickMultipliers
      );
      content += `<text x="${sx + 4}" y="${
        sy - 2
      }" text-anchor="middle" dominant-baseline="middle">${Math.round(
        label
      )}</text>`;
    }
  }

  return content;
}

// Main draw function to orchestrate grid, axes, and ticks
export function draw(
  svg,
  width,
  height,
  scale,
  scaleLevels,
  scaleIndex,
  tickMultipliers,
  offsetX,
  offsetY
) {
  const worldToScreen = (x, y) => [offsetX + x * scale, offsetY - y * scale];

  const screenToWorld = (sx, sy) => [
    (sx - offsetX) / scale,
    (offsetY - sy) / scale,
  ];

  const [x0, y0] = screenToWorld(0, height);
  const [x1, y1] = screenToWorld(width, 0);
  let svgContent = "";

  const smallGridIncrement = calculateSmallGridIncrement(
    scale,
    scaleLevels,
    scaleIndex
  );
  const largeGridIncrement = calculateLargeGridIncrement(
    scale,
    scaleLevels,
    scaleIndex,
    tickMultipliers
  );

  svgContent += drawMinorGrid(
    x0,
    x1,
    y0,
    y1,
    smallGridIncrement,
    worldToScreen
  );
  svgContent += drawMajorGrid(
    x0,
    x1,
    y0,
    y1,
    largeGridIncrement,
    worldToScreen
  );
  svgContent += drawAxes(
    x0,
    x1,
    y0,
    y1,
    worldToScreen,
    width,
    height,
    (x0, x1, y0, y1, xVisible, yVisible) =>
      drawStickyAxes(
        x0,
        x1,
        y0,
        y1,
        xVisible,
        yVisible,
        worldToScreen,
        width,
        height,
        scale,
        scaleLevels,
        scaleIndex,
        tickMultipliers
      )
  );
  svgContent += drawTicks(
    x0,
    x1,
    y0,
    y1,
    worldToScreen,
    scale,
    scaleLevels,
    scaleIndex,
    tickMultipliers,
    width,
    height
  );

  svg.innerHTML = svgContent;
}
