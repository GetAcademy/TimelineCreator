function setSort(key) {
  model.viewState.main.sortBy = key;
  updateViewMain();
}

function previewTimeline(timelineId) {
  model.app.activeTimelineId = timelineId;
  updateViewMain();
}