export function checkAllPoints(userPoints, questionPoints) {
  if (userPoints.length !== questionPoints.length) return false;
  return userPoints.every((p) =>
    questionPoints.some((q) => q.x == p.x && q.y == p.y)
  );
}

export function checkAllLines(userLines, questionLines, questionPoints) {
  userLines = removeMatchingCoordinates(userLines);
    userLines = removeDuplicateObjects(userLines);

  if (userLines.length !== questionLines.length) return false;
  return userLines.every((userLine) => {
    return questionLines.some((dataLine) => {
      const p1 = questionPoints[dataLine.p1 - 1];
      const p2 = questionPoints[dataLine.p2 - 1];

      const condition1 =
        p1.x == userLine.x1 &&
        p1.y == userLine.y1 &&
        p2.x == userLine.x2 &&
        p2.y == userLine.y2;

      const condition2 =
        p2.x == userLine.x1 &&
        p2.y == userLine.y1 &&
        p1.x == userLine.x2 &&
        p1.y == userLine.y2;

      return condition1 || condition2;
    });
  });
}

function removeMatchingCoordinates(arr) {
  return arr.filter((obj) => obj.x1 !== obj.x2 || obj.y1 !== obj.y2);
}
function removeDuplicateObjects(arr) {
    const seen = new Set();
    return arr.filter(obj => {
        const key = JSON.stringify([obj.x1, obj.y1, obj.x2, obj.y2]);
        if (seen.has(key)) {
            return false; 
        }
        seen.add(key);
        return true; 
    });
}
