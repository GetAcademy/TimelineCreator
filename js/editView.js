

/* ========== VIEW-FUNKSJON ========== */

function updateViewEdit() {
  ensureEditCopy();
  const tl   = model.viewState.edit.timeline;
  const segs = tl.segments;

  /* ---------- rader med segmenter ---------- */
  const rows = segs.map((seg, i) => `
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
  `).join('');

  /* ---------- bygg hele siden ---------- */
  document.getElementById('app').innerHTML = `
    <h1>Rediger tidslinje</h1>

    <section style="margin-bottom:1rem;display:flex;gap:1.5rem;flex-wrap:wrap;">
      <label> Tittel:<br>
        <input type="text" value="${tl.title.replace(/"/g,'&quot;')}"
               oninput="setTimelineTitle(this.value)" style="min-width:260px;">
      </label>

      <label> Spor-farge:<br>
        <input type="color" value="${tl.trackColor}"
               onchange="setTimelineTrackColor(this.value)">
      </label>

      <label> Tekst-farge:<br>
        <input type="color" value="${tl.textColor}"
               onchange="setTimelineTextColor(this.value)">
      </label>
    </section>

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
      <button onclick="saveTimeline()"   style="padding:.5rem 1rem;">💾 Lagre</button>
      <button onclick="discardChanges()" style="padding:.5rem 1rem;margin-left:.5rem;">
        ❌ Forkast
      </button>
    </div>
  `;
}
