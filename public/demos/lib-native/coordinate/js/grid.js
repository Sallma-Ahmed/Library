 export function drawGrid(viewBox, gridStep, maxGridStep, vLines, hLines, labelsGroup) {
  vLines.innerHTML = "";
  hLines.innerHTML = "";
  labelsGroup.innerHTML = "";

  const minX = Math.floor(viewBox.x);
  const maxX = Math.ceil(viewBox.x + viewBox.width);
  const minY = Math.floor(viewBox.y);
  const maxY = Math.ceil(viewBox.y + viewBox.height);

  for (
    let x = Math.ceil(minX / gridStep) * gridStep;
    x <= maxX;
    x += gridStep
  ) {
    vLines.innerHTML += `<line x1="${x}" y1="${-maxGridStep}" x2="${x}" y2="${maxGridStep}" class="line"/>`;
    labelsGroup.innerHTML += `<text x="${x}" y="0" class="label">${x}</text>`;
  }

  for (
    let y = Math.ceil(minY / gridStep) * gridStep;
    y <= maxY;
    y += gridStep
  ) {
    hLines.innerHTML += `<line x1="${-maxGridStep}" y1="${y}" x2="${maxGridStep}" y2="${y}" class="line"/>`;
    if (y !== 0) {
      labelsGroup.innerHTML += `<text x="0" y="${y}" class="label">${y}</text>`;
    }
  }
}
