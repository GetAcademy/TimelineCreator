/* ========== HELPERS ========== */

// Deep-clone (enkelt i trinn 1)
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Gjør en jevn ny beregning av position-feltene etter hver endring
function recalcPositions(segArr) {
  const n = segArr.length;
  segArr.forEach((seg, i) => {
    seg.position = n === 1 ? 0 : Math.round((i * 100) / (n - 1));
  });
}

/* ========== CONTROLLERE ========== */

function ensureEditCopy() {
  const id   = model.app.activeTimelineId;
  const copy = model.viewState.edit.timeline;
  if (!copy || copy.id !== id) {
    const original = model.timelines.find(t => t.id === id);
    model.viewState.edit.timeline = clone(original);
  }
}

/* ---- segment-handling ---- */
function editSegmentLabel(idx, value) {
  model.viewState.edit.timeline.segments[idx].label = value;
}
function moveSegmentUp(idx) {
  const arr = model.viewState.edit.timeline.segments;
  if (idx === 0) return;
  [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
  recalcPositions(arr);
  updateViewEdit();
}
function moveSegmentDown(idx) {
  const arr = model.viewState.edit.timeline.segments;
  if (idx === arr.length - 1) return;
  [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
  recalcPositions(arr);
  updateViewEdit();
}
function deleteSegment(idx) {
  const arr = model.viewState.edit.timeline.segments;
  arr.splice(idx, 1);
  recalcPositions(arr);
  updateViewEdit();
}
function addSegment() {
  const arr = model.viewState.edit.timeline.segments;
  arr.push({ id: 's' + Date.now(), label: 'Nytt punkt', position: 100 });
  recalcPositions(arr);
  updateViewEdit();
}

/* ---- lagre & forkast ---- */
function saveTimeline() {
  const id     = model.app.activeTimelineId;
  const index  = model.timelines.findIndex(t => t.id === id);
  if (index === -1) return alert('Ukjent tidslinje');

  // kopier arbeidskopi → hovedmodell
  model.timelines[index] = clone(model.viewState.edit.timeline);
  model.timelines[index].updatedAt = new Date().toISOString();

  model.app.currentPage = 'main';
  updateViewMain();
}
function discardChanges() {
  model.viewState.edit = {};       // kast arbeidskopi
  model.app.currentPage = 'main';
  updateViewMain();
}