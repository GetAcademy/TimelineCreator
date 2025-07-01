
function formatDate(date) {
  return new Date(date).toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}
/* ---------- helper: bygger et lite SVG-preview ---------- */
function generateTimelinePreview(tl) {
  if (!tl) return '';

  // Dimensjoner
  const margin = 20;
  const isHor  = tl.orientation === 'horizontal';
  const span   = 400;               // lengde på sporet
  const trackW = 6;                 // tykkelse på sporet
  const r      = 8;                 // radius på punkter

  // Størrelse på SVG-boksen
  const w = isHor ? span + margin * 2 : 120;
  const h = isHor ? 120 : span + margin * 2;

  // Funksjon for å mappe position (0-100 %) til X/Y-koordinat
  const posToCoord = p =>
    isHor
      ? { x: margin + (p / 100) * span, y: h / 2 }
      : { x: w / 2, y: margin + (p / 100) * span };

  // Selve SVG-strengen
  const lineStart = posToCoord(0);
  const lineEnd   = posToCoord(100);

  const segmentsSvg = tl.segments
    .map(seg => {
      const { x, y } = posToCoord(seg.position);
      const fill = seg.color || tl.textColor;
      return `
        <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>
        <text x="${x}" y="${isHor ? y - 15 : x + 15}" text-anchor="middle"
              font-size="12" fill="${tl.textColor}">${seg.label}</text>
      `;
    })
    .join('');

  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
         xmlns="http://www.w3.org/2000/svg" class="timeline-preview-svg">
      <${isHor ? 'line' : 'line'}
        x1="${lineStart.x}" y1="${lineStart.y}"
        x2="${lineEnd.x}"   y2="${lineEnd.y}"
        stroke="${tl.trackColor}" stroke-width="${trackW}" />
      ${segmentsSvg}
    </svg>
  `;
}

/* ------------ Rask SVG-forhåndsvisning ------------ */
//  (samme generateTimelinePreview som tidligere)

function updateViewMain() {
  const sortBy = model.viewState.main.sortBy || 'title';

  // 1. Sorter kopien
  const timelines = [...model.timelines].sort((a, b) => {
    switch (sortBy) {
      case 'created': return new Date(a.createdAt) - new Date(b.createdAt);
      case 'updated': return new Date(b.updatedAt) - new Date(a.updatedAt);
      default:        return a.title.localeCompare(b.title);
    }
  });

  // 2. Bygg tabellrader
  const rowsHtml = timelines.map(tl => `
    <tr ${model.app.activeTimelineId === tl.id ? 'class="selected"' : ''}>
      <td>${tl.title}</td>
      <td>${formatDate(tl.createdAt)}</td>
      <td>${formatDate(tl.updatedAt)}</td>
      <td>${tl.orientation}</td>
      <td style="text-align:center">${tl.segments.length}</td>
      <td class="actions">
        <button onclick="previewTimeline('${tl.id}')" title="Forhåndsvis">👁️</button>
        <button onclick="goToViewTimeline('${tl.id}')" title="Åpne visning">Vis</button>
        <button onclick="goToEditTimeline('${tl.id}')" title="Rediger">Rediger</button>
        <button onclick="deleteTimeline('${tl.id}')" title="Slett">🗑️</button>
      </td>
    </tr>
  `).join('');

  // 3. Forhåndsvisning
  const active = timelines.find(tl => tl.id === model.app.activeTimelineId);
  const previewHtml = active
    ? `<h2>Forhåndsvisning: ${active.title}</h2>${generateTimelinePreview(active)}`
    : '<p>Velg «👁️» for å forhåndsvise en tidslinje.</p>';

  // 4. Render inn i #app
  document.getElementById('app').innerHTML = `
    ${previewHtml}

    <h1>Mine tidslinjer</h1>

    <table class="timeline-table">
      <thead>
        <tr>
          <th onclick="setSort('title')">Tittel ▲</th>
          <th onclick="setSort('created')">Opprettet</th>
          <th onclick="setSort('updated')">Endret</th>
          <th>Orient.</th>
          <th>#</th>
          <th>Handlinger</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

