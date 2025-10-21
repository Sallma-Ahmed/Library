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
    value * (scaleLevels[scaleIndex] / BASE_SCALE) * tickMultipliers[scaleIndex]
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
    content += `<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#e6e6e6" stroke-width="0.4"/>`;
  }

  for (let gy = gridY0; gy <= gridY1 + increment / 2; gy += increment) {
    const [sx0, sy0] = worldToScreen(x0, gy);
    const [sx1, sy1] = worldToScreen(x1, gy);
    content += `<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#e6e6e6" stroke-width="0.4"/>`;
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
    content += `<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#c0c0c0" stroke-width="0.5"/>`;
  }

  for (let gy = gridY0; gy <= gridY1 + increment / 2; gy += increment) {
    const [sx0, sy0] = worldToScreen(x0, gy);
    const [sx1, sy1] = worldToScreen(x1, gy);
    content += `<line x1="${sx0}" y1="${sy0}" x2="${sx1}" y2="${sy1}" stroke="#c0c0c0" stroke-width="0.5"/>`;
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
  const yVisible = sxY0 >= 0 && sxY0 <= width - 5;
  console.log(width);
  console.log(height);
  console.log(sxY0);
  console.log(window.innerWidth);
  console.log(window.innerHeight);

  if (yVisible) {
    content += `<line x1="${sxY0}" y1="${syY0}" x2="${sxY1}" y2="${syY1}" stroke="black" stroke-width="0.5"/>`;
  }
  if (xVisible) {
    content += `<line x5="${sxX0}" y1="${syX0}" x2="${sxX1}" y2="${syX1}" stroke="black" stroke-width="0.5"/>`;
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
    console.log("hi");
    const yPos = syX0 < 0 ? 5 : height - 5;
    content += `<line x1="0" y1="${yPos}" x2="${width}" y2="${yPos}" stroke="black"  stroke-width="0.3"/>`;
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
        yPos + 1
      }" text-anchor="end" dominant-baseline="middle" class="text-x">${Math.round(
        label
      )}</text>`;
    }
  }

  if (!yVisible) {
    console.log("!yVisible");
    const xPos = sxY0 < 0 ? 5 : width - 15;
    content += `<line x1="${xPos}" y1="0" x2="${xPos}" y2="${height}" stroke="black"  stroke-width="0.3"/>`;
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
        xPos + 5
      }" y="${sy}" text-anchor="end" dominant-baseline="middle" class="text-x">${Math.round(
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
      }" text-anchor="middle " class="text-x">${Math.round(label)}</text>`;
    }
  }

  if (yVisible) {
    console.log("yVisible");
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
      if (Math.round(label != 0)) {
        content += `<text x="${sx + 4}" y="${
          sy - 2
        }" text-anchor="middle" dominant-baseline="middle" class="text-x">${Math.round(
          label
        )}</text>`;
      }
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
  offsetY,
  points,
  lines,
  color,
  checkedDraw,
  showDraw
) {
  if (showDraw) {
    console.log(points);
    const fit = moveGraphToFitAllPoints(width, height, points);
    scale = fit.scale;
    offsetX = fit.offsetX;
    offsetY = fit.offsetY;
    scaleIndex = fit.scaleIndex;
  }
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
  svgContent += drawPoints(points, worldToScreen);
  svgContent += drawLines(lines, worldToScreen);
  if (checkedDraw) {
    svgContent += createPolygonElement(points, color, worldToScreen);
  }

  svg.innerHTML = svgContent;
}
function drawPoints(points, worldToScreen) {
  let svgContent = "";
  if (typeof onClick === "function") {
    circle.addEventListener("click", onClick);
  }
  for (const p of points) {
    const [sx, sy] = worldToScreen(p.x, p.y);

    // Circle marker
    svgContent += `<circle 
      cx="${sx}" 
      cy="${sy}" 
      r="12" 
      fill="${p.color || "orange"}" 
      stroke="white" 
      class="point"
    />`;

    // Optional label (show integer coords)
  
  }

  return svgContent;
}

function drawLines(lines, worldToScreen) {
  let svgContent = "";
  lines = removeMatchingCoordinates(lines);
  for (const line of lines) {
    const [sx1, sy1] = worldToScreen(line.x1, line.y1);
    const [sx2, sy2] = worldToScreen(line.x2, line.y2);
    svgContent += `<line 
      x1="${sx1}" y1="${sy1}" 
      x2="${sx2}" y2="${sy2}" 
      stroke="red" stroke-width="2"
    />`;
  }
  return svgContent;
}
function removeMatchingCoordinates(arr) {
  return arr.filter((obj) => obj.x1 !== obj.x2 || obj.y1 !== obj.y2);
}
function createPolygonElement(points, color, worldToScreen) {
  console.log(points);
  const pointsAttr = points
    .map((p) => {
      const [sx, sy] = worldToScreen(p.x, p.y);
      return `${sx},${sy}`;
    })
    .join(" ");

  return `<polygon 
    points="${pointsAttr}" 
    fill="${color}" 
    stroke="black" 
    stroke-width="0.1"
  />`;
}


function getBoundingBox(points) {
  let xs = [];
  let ys = [];

  for (const p of points) {
    xs.push(p.x);
    ys.push(p.y);
  }
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}
function moveGraphToFitAllPoints(
  svgWidth,
  svgHeight,
  points,
  padding = 20,
  zoomOutFactor = 0.5
) {
  const { minX, maxX, minY, maxY } = getBoundingBox(points);
  const spanX = maxX - minX;
  const spanY = maxY - minY;
  const span = Math.max(spanX, spanY);

  // scaleIndex بناءً على المدى
  let scaleIndex = 0;
  if (span <= 10) scaleIndex = 0;
  else if (span <= 100) scaleIndex = 1;
  else if (span <= 1000) scaleIndex = 2;

  // scale فعلي للحجم المناسب
  const scaleX = (svgWidth - 2 * padding) / spanX;
  const scaleY = (svgHeight - 2 * padding) / spanY;
  let scale = Math.min(scaleX, scaleY) * zoomOutFactor;

  const offsetX = padding - minX * scale + (svgWidth - spanX * scale) / 2;
  const offsetY = padding + maxY * scale + (svgHeight - spanY * scale) / 2;

  return { scale, offsetX, offsetY, scaleIndex };
}
