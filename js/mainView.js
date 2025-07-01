
function formatDate(date) {
    return new Date(date).toLocaleDateString('nb-NO', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
}

function createTimelineSvg(tl, {
    span = 400,   // preview: litt under ½ skjermbredde
    sidePad = 60,    // nok luft til første/siste tekst
    fontSize = 12,
    trackWidth = 6,
    radius = 8,
} = {}) {
    const isHor = tl.orientation === 'horizontal';

    /* ---- viewBox-størrelse ---- */
    const w = isHor ? span + sidePad * 2 : 140;
    const h = isHor ? fontSize * 6 + sidePad : span + sidePad * 2;

    /* ---- posisjonshjelper (0–100 %) ---- */
    const pos = p =>
        isHor
            ? { x: sidePad + (p / 100) * span, y: h / 2 }
            : { x: 60, y: sidePad + (p / 100) * span };

    const a = pos(0), b = pos(100);

    /* ---- punkter + etiketter ---- */
    const segs = tl.segments.map(s => {
        const { x, y } = pos(s.position);
        const fill = s.color || tl.textColor;

        return isHor
            ? `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}"/>
         <text x="${x}" y="${y - radius - 4}" text-anchor="middle"
               font-size="${fontSize}" fill="${tl.textColor}">${s.label}</text>`
            : `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}"/>
         <text x="${x + radius + 12}" y="${y + fontSize / 3}"
               text-anchor="start" font-size="${fontSize}"
               fill="${tl.textColor}">${s.label}</text>`;
    }).join('');

    /* ---- ferdig SVG ---- */
    return `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <style> text{font-family:sans-serif;} </style>
  <line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"
        stroke="${tl.trackColor}" stroke-width="${trackWidth}"/>
  ${segs}
</svg>`;
}



function updateViewMain() {
    const vs = model.viewState.main;
    const dirMul = vs.sortDir === 'asc' ? 1 : -1;

    /* ----------  sorter kopien  ---------- */
    const timelines = [...model.timelines].sort((a, b) => {
        const val = {
            title: () => a.title.localeCompare(b.title),
            created: () => new Date(a.createdAt) - new Date(b.createdAt),
            updated: () => new Date(a.updatedAt) - new Date(b.updatedAt),
            orientation: () => a.orientation.localeCompare(b.orientation),
            count: () => a.segments.length - b.segments.length,
        }[vs.sortBy]();
        return val * dirMul;
    });

    /* ----------  bygg tabellhoder med piler  ---------- */
    const headerCols = [
        { key: 'title', label: 'Tittel' },
        { key: 'created', label: 'Opprettet' },
        { key: 'updated', label: 'Endret' },
        { key: 'orientation', label: 'Orient.' },
        { key: 'count', label: '#' },
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
        <button onclick="goToEditTimeline('${tl.id}')" title="Rediger">📝</button>
        <button onclick="deleteTimeline('${tl.id}')" title="Slett">🗑️</button>
        <button onclick="exportTimeline('${tl.id}')" title="Last ned SVG">⬇️</button>
      </td>
    </tr>
  `).join('');

    /* ----------  forhåndsvisning  ---------- */
    const active = timelines.find(tl => tl.id === model.app.activeTimelineId);
    const preview = active ? createTimelineSvg(active)
        : '<p>Velg «👁️» for å forhåndsvise.</p>';
    const isVert = active && active.orientation === 'vertical';

    /* ----------  render  ---------- */
    const table = `
    <h1>Mine tidslinjer</h1>
    <table class="timeline-table">
      <thead><tr>${thHtml}</tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>`;

    const dir = isVert ? 'row' : 'column';
    document.getElementById('app').innerHTML = `
        <div style="display:flex;gap:2rem;flex-direction:${dir};">
            <div>${table}</div>
            <div >${preview}</div>
       </div>`;
}
