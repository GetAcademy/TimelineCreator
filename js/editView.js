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

/* ========== VIEW-FUNKSJON ========== */

function updateViewEdit() {
  ensureEditCopy();
  const tl   = model.viewState.edit.timeline;
  const segs = tl.segments;

  const rows = segs
    .map((seg, i) => `
      <tr>
        <td style="width:60px;text-align:center">${seg.position}%</td>
        <td>
          <input type="text" value="${seg.label.replace(/"/g,'&quot;')}"
                 oninput="editSegmentLabel(${i}, this.value)" />
        </td>
        <td class="actions">
          <button onclick="moveSegmentUp(${i})"   title="Opp">▲</button>
          <button onclick="moveSegmentDown(${i})" title="Ned">▼</button>
          <button onclick="deleteSegment(${i})"   title="Slett">🗑️</button>
        </td>
      </tr>
    `)
    .join('');

  document.getElementById('app').innerHTML = `
    <h1>Rediger tidslinje: ${tl.title}</h1>

    <table class="edit-table">
      <thead>
        <tr><th>%</th><th>Tekst</th><th>Handlinger</th></tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <td colspan="3" style="text-align:center">
            <button onclick="addSegment()">+ Legg til punkt</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top:1rem;">
      <button onclick="saveTimeline()"    style="padding:.5rem 1rem;">💾 Lagre</button>
      <button onclick="discardChanges()"  style="padding:.5rem 1rem;margin-left:.5rem;">
        ❌ Forkast
      </button>
    </div>
  `;
}

/* ========== LITT NY CSS (valgfritt) ========== */
/*
.edit-table input { width:100%; }
.edit-table .actions button { margin:0 .2rem; }
*/
