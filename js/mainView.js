/* ----------  helpers & bootstrapping  ---------- */

// Sett default-datoer hvis de ikke finnes ennå
model.timelines.forEach(tl => {
  if (!tl.createdAt)  tl.createdAt  = new Date();      // nå-tid som enkel fallback
  if (!tl.updatedAt) tl.updatedAt  = tl.createdAt;
});

function formatDate(date) {
  return new Date(date).toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}


function updateViewMain() {
  const sortBy = model.viewState.main.sortBy || 'title';

  // 1. sorter kopien av lista
  const timelines = [...model.timelines].sort((a, b) => {
    switch (sortBy) {
      case 'created': return new Date(a.createdAt) - new Date(b.createdAt);
      case 'updated': return new Date(b.updatedAt) - new Date(a.updatedAt);
      default:        return a.title.localeCompare(b.title);
    }
  });

  // 2. bygg <tr>-rader
  const rowsHtml = timelines
    .map(tl => `
      <tr onclick="previewTimeline('${tl.id}')" ${model.app.activeTimelineId === tl.id ? 'class="selected"' : ''}>
        <td>${tl.title}</td>
        <td>${formatDate(tl.createdAt)}</td>
        <td>${formatDate(tl.updatedAt)}</td>
        <td>${tl.orientation}</td>
        <td style="text-align:center">${tl.segments.length}</td>
        <td><button onclick="previewTimeline('${tl.id}')">Vis</button></td>
      </tr>
    `)
    .join('');

  // 3. sett hele app-diven
  document.getElementById('app').innerHTML = `
    <h1>Mine tidslinjer</h1>

    <table class="timeline-table">
      <thead>
        <tr>
          <th onclick="setSort('title')">Tittel ▲</th>
          <th onclick="setSort('created')">Opprettet</th>
          <th onclick="setSort('updated')">Endret</th>
          <th>Orient.</th>
          <th>#</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- (plass til framtidig forhåndsvisning) -->
    <div id="timeline-preview" class="preview-box"></div>
  `;
}

