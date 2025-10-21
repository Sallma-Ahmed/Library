export function createPointElement(pt, onClick) {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  circle.setAttribute("cx", pt.x);
  circle.setAttribute("cy", -pt.y);
  circle.setAttribute("r", "0.2");
  circle.setAttribute("class", "point");
  circle.setAttribute("fill", "black");
  circle.dataset.x = pt.x;
  circle.dataset.y = pt.y;
  circle.dataset.id = pt.id;

  if (typeof onClick === "function"  ) {
    circle.addEventListener("click", onClick);
  }

  return circle;
}

export function createLineElement(p1, p2) {
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", p1.x);
  line.setAttribute("y1", -p1.y);
  line.setAttribute("x2", p2.x);
  line.setAttribute("y2", -p2.y);
  line.setAttribute("stroke", "black");
  line.setAttribute("stroke-width", "0.2");
  return line;
}

export function createPolygonElement(points,color) {
  const polygon = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon"
  );
  const pointsAttr = points
    .map((p) => `${p.x},${-p.y}`) 
    .join(" ");
    console.log(pointsAttr)

  polygon.setAttribute("points", pointsAttr);
  polygon.setAttribute("fill", color);
  polygon.setAttribute("stroke", "black");
  polygon.setAttribute("stroke-width", "0.1");
  return polygon;
}


export function moveGraphToFitAllPoints(points, viewBox, padding) {
  if (points.length === 0) return viewBox;
  
  const ys = points.map(p => p.y);
  const top = Math.max(...ys);
  const bottom = Math.min(...ys);
  const xs = points.map(p => p.x);
  const right = Math.max(...xs);
  const left = Math.min(...xs);

  return {
    x: left - padding,
    width: right - left + 2 * padding,
    y: -(top + padding),
    height: top - bottom + 2 * padding
  };
}
