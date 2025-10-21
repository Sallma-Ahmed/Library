
export function undoLastAction(state) {
  const worldToScreen = (x, y) => [
    state.offsetX + x * state.scale,
    state.offsetY - y * state.scale,
  ];
  const screenToWorld = (sx, sy) => [
    (sx - state.offsetX) / state.scale,
    (state.offsetY - sy) / state.scale,
  ];
  if (state.allActions.length === 0) return;

  const lastAction = state.allActions.pop();
  state.HistroyActions.push(lastAction);

  if (lastAction.type === 1) {
    // إزالة نقطة
    const [x, y] = worldToScreen(lastAction.x, lastAction.y);
    console.log(x);
    console.log(y);

    const circle = document.querySelector(`[cx="${x}"][cy="${y}"]`);
    console.log(circle);
    if (circle) circle.remove();

    state.HistroyPoints.push(lastAction);
    state.points.pop();
  } else if (lastAction.type === 2) {
    // إزالة خط
    const [x1, y1] = worldToScreen(lastAction.x1, lastAction.y1);
    const [x2, y2] = worldToScreen(lastAction.x2, lastAction.y2);

    const line = document.querySelector(
      `line[x1="${x1}"][y1="${y1}"][x2="${x2}"][y2="${y2}"]`
    );
    if (line) line.remove();

    state.HistroyLines.push(lastAction);
    state.lines.pop();
  }

  state.redoOption = true;
}

export function redoLastAction(state, drawGrid) {
  if (!state.redoOption || state.HistroyActions.length === 0) return;
  const lastRedo = state.HistroyActions.pop();
  state.allActions.push(lastRedo);
  if (lastRedo.type === 1) {
    state.points.push(lastRedo);
    state.HistroyPoints.pop();
    drawGrid(); // ترسم النقطة تاني
  } else if (lastRedo.type === 2) {
    state.lines.push(lastRedo);
    state.HistroyLines.pop();
    const p1 = { x: lastRedo.x1, y: -lastRedo.y1 };
    const p2 = { x: lastRedo.x2, y: -lastRedo.y2 };
    drawGrid();
  }
}
