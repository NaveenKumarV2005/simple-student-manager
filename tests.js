
const assert = require("node:assert/strict");

function calculateAverage(marks) {
  if (marks.length === 0) return 0;

  return marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
}

assert.equal(calculateAverage([80, 90]), 85);
assert.equal(calculateAverage([50, 70, 90]), 70);
assert.equal(calculateAverage([]), 0);

console.log("All tests passed!");
