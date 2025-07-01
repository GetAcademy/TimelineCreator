
function formatDate(date) {
  return new Date(date).toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}
function generateTimelinePreview(tl) {
  if (!tl) return '';

  /* --- padding og dimensjoner --- */
  const isHor   = tl.orientation === 'horizontal';
  const sidePad = isHor ? 60 : 20;   //  ←  mer rom venstre/høyre
  const span    = 400;               // lengden selve sporet skal dekke
  const trackW  = 6;
  const r       = 8;

  /* viewBox-størrelse */
  const w = isHor ? span + sidePad * 2 : 140;
  const h = isHor ? 120               : span + sidePad * 2;

  /* 0–100 %  →  x,y  */
  const posToCoord = p =>
    isHor
      ? { x: sidePad + (p / 100) * span, y: h / 2 }
      : { x: 40,                         y: sidePad + (p / 100) * span };

  const start = posToCoord(0);
  const end   = posToCoord(100);

  /* punkter + etiketter */
  const segmentsSvg = tl.segments.map(seg => {
    const { x, y } = posToCoord(seg.position);
    const fill = seg.color || tl.textColor;

    return isHor
      ? `
        <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>
        <text x="${x}" y="${y - 15}" text-anchor="middle"
              font-size="12" fill="${tl.textColor}">${seg.label}</text>`
      : `
        <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>
        <text x="${x + 15}" y="${y + 4}" text-anchor="start"
              font-size="12" fill="${tl.textColor}">${seg.label}</text>`;
  }).join('');

  /* full SVG-streng */
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"
         xmlns="http://www.w3.org/2000/svg" class="timeline-preview-svg">
      <line x1="${start.x}" y1="${start.y}"
            x2="${end.x}"   y2="${end.y}"
            stroke="${tl.trackColor}" stroke-width="${trackW}" />
      ${segmentsSvg}
    </svg>
  `;
}



function updateViewMain() {
  const vs      = model.viewState.main;
  const dirMul  = vs.sortDir === 'asc' ? 1 : -1;

  /* ----------  sorter kopien  ---------- */
  const timelines = [...model.timelines].sort((a, b) => {
    const val = {
      title:       () => a.title.localeCompare(b.title),
      created:     () => new Date(a.createdAt) - new Date(b.createdAt),
      updated:     () => new Date(a.updatedAt) - new Date(b.updatedAt),
      orientation: () => a.orientation.localeCompare(b.orientation),
      count:       () => a.segments.length - b.segments.length,
    }[vs.sortBy]();
    return val * dirMul;
  });

  /* ----------  bygg tabellhoder med piler  ---------- */
  const headerCols = [
    { key: 'title',       label: 'Tittel'      },
    { key: 'created',     label: 'Opprettet'   },
    { key: 'updated',     label: 'Endret'      },
    { key: 'orientation', label: 'Orient.'     },
    { key: 'count',       label: '#'           },
  ];

  const thHtml = headerCols.map(c => {
    const arrow = vs.sortBy === c.key ? (vs.sortDir === 'asc' ? '▲' : '▼') : '';
    return `<th onclick="setSort('${c.key}')">${c.label} ${arrow}</th>`;
  }).join('') + '<th>Handlinger</th>';

  /* ----------  tabellrader  ---------- */
  const rowsHtml = timelines.map(tl => `
    <tr ${model.app.activeTimelineId === tl.id ? 'class="selected"' : ''}>
      <td>${tl.title}</td>
      <td>${formatDate(tl.createdAt)}</td>
      <td>${formatDate(tl.updatedAt)}</td>
      <td>${tl.orientation}</td>
      <td style="text-align:center">${tl.segments.length}</td>
      <td class="actions">
        <button onclick="previewTimeline('${tl.id}')" title="Forhåndsvis">👁️</button>
        <button onclick="goToViewTimeline('${tl.id}')" title="Vis">Vis</button>
        <button onclick="goToEditTimeline('${tl.id}')" title="Rediger">Rediger</button>
        <button onclick="deleteTimeline('${tl.id}')" title="Slett">🗑️</button>
      </td>
    </tr>
  `).join('');

  /* ----------  forhåndsvisning  ---------- */
  const active   = timelines.find(tl => tl.id === model.app.activeTimelineId);
  const preview  = active ? generateTimelinePreview(active)
                          : '<p>Velg «👁️» for å forhåndsvise.</p>';
  const isVert   = active && active.orientation === 'vertical';

  /* ----------  render  ---------- */
  const table = `
    <h1>Mine tidslinjer</h1>
    <table class="timeline-table">
      <thead><tr>${thHtml}</tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>`;

  document.getElementById('app').innerHTML = isVert
    ? `<div style="display:flex;gap:2rem;">
        <div>${table}</div>
        <div >${preview}</div>
       </div>`
    : `${table}<div class="center">${preview}</div>`;
}
