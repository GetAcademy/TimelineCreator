function setSort(key) {
  const vs = model.viewState.main;
  if (vs.sortBy === key) {
    vs.sortDir = vs.sortDir === 'asc' ? 'desc' : 'asc';
  } else {
    vs.sortBy = key;
    vs.sortDir = 'asc';
  }
  updateViewMain();
}


function previewTimeline(timelineId) {
    model.app.activeTimelineId = timelineId;
    updateViewMain();
}

function goToViewTimeline(id) { console.log('TODO view', id); }
function goToEditTimeline(id) { console.log('TODO edit', id); }
function deleteTimeline(id) { console.log('TODO delete', id); }