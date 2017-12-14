let storage;

function setSaveButtonState(state) {
  const button = $("#save-statement-position");
  if (state) {
    button.removeAttr("disabled");
    button.css("cursor", "pointer");
    button.addClass("btn-success");
    button.removeClass("btn-secondary");
  } else {
    button.attr("disabled", "disabled");
    button.css("cursor", "default");
    button.removeClass("btn-success");
    button.addClass("btn-secondary");
  }
}

function setRemoveButtonState(state) {
  const button = $("#remove-statement-position");
  if (state) {
    button.removeAttr("disabled");
    button.css("cursor", "pointer");
    button.addClass("btn-danger");
    button.removeClass("btn-secondary");
  } else {
    button.attr("disabled", "disabled");
    button.css("cursor", "default");
    button.removeClass("btn-danger");
    button.addClass("btn-secondary");
  }
}

function existSavedPosition(id) {
  const savedStart = storage.getItem(`${id}-start`);
  const savedEnd = storage.getItem(`${id}-end`);
  return savedStart !== null && savedEnd !== null;
}

function onStatementClick() {
  const id = $(this).attr("data-statement-id");
  storage.setItem("current-id", id);

  setSaveButtonState(false);

  const exist = existSavedPosition(id);
  setRemoveButtonState(exist);

  reloadStatements();
}

function reloadStatements() {
  $(".statement").each(function(index, statement) {

    const id = $(statement).attr("data-statement-id");
    const savedStart = storage.getItem(`${id}-start`);
    const savedEnd = storage.getItem(`${id}-end`);
    const saveExist = savedStart !== null && savedEnd !== null;

    if (saveExist) {
      $(statement).addClass("statement-saved");
    } else {
      $(statement).removeClass("statement-saved");
    }

    if (storage.getItem("current-id") === id) {
      $(statement).addClass("statement-selected");

      const originalText = $("#speech-original").text();

      const preSelectionElem = $(".pre-selection").first();
      const selectionElem = $(".selection").first();
      const postSelectionElem = $(".post-selection").first();

      if (saveExist) {
        const preSelectionText = originalText.substring(0, savedStart);
        preSelectionElem.text(preSelectionText);

        const selectionText = originalText.substring(savedStart, savedEnd);
        selectionElem.text(selectionText);

        const postSelectionText = originalText.substring(savedEnd, originalText.length);
        postSelectionElem.text(postSelectionText);
      } else {
        preSelectionElem.text(originalText);
        selectionElem.text("");
        postSelectionElem.text("");
      }

    } else {
      $(statement).removeClass("statement-selected")
    }

  });
}

function onSaveStatementPositionClick(event) {
  event.preventDefault();

  const range = getSelection().getRangeAt(0);
  const start = range.startOffset;
  const end = range.endOffset;
  const classes = range.startContainer.parentElement.classList;
  const isPreSelection = classes.contains("pre-selection");
  const isSelection = classes.contains("selection");
  const isPostSelection = classes.contains("post-selection");

  let startPositionInOriginal = 0;
  if (isPreSelection) {
    startPositionInOriginal = start
  } else if (isSelection) {
    startPositionInOriginal = $(".pre-selection").text().toString().length + start;
  } else if (isPostSelection) {
    startPositionInOriginal = $(".pre-selection").text().toString().length + $(".selection").text().toString().length + start;
  }
  let endPositionInOriginal = startPositionInOriginal + (end - start);

  let originalText = $("#speech-original").text().toString();
  let rnOccurrencesToStart = (originalText.substr(0, startPositionInOriginal).match(new RegExp("\n|\r", "g")) || []).length;
  let start2 = startPositionInOriginal + rnOccurrencesToStart;
  let rnOccurrencesToEnd = (originalText.substr(0, endPositionInOriginal).match(new RegExp("\n|\r", "g")) || []).length;
  let end2 = endPositionInOriginal + rnOccurrencesToEnd;

  let fragment = originalText.substr(startPositionInOriginal, (endPositionInOriginal - startPositionInOriginal));

  const currentId = storage.getItem("current-id");
  storage.setItem(`${currentId}-start`, startPositionInOriginal.toString());
  storage.setItem(`${currentId}-end`, endPositionInOriginal.toString());
  storage.setItem(`${currentId}-start2`, start2.toString());
  storage.setItem(`${currentId}-end2`, end2.toString());
  storage.setItem(`${currentId}-fragment`, fragment);

  setRemoveButtonState(true);

  reloadStatements();
}

function onRemoveStatementPositionClick(event) {
  event.preventDefault();

  const currentId = storage.getItem("current-id");
  storage.removeItem(`${currentId}-start`);
  storage.removeItem(`${currentId}-end`);

  setRemoveButtonState(false);

  reloadStatements();
}

function initSaveStatementPositionButton() {
  const button = $("#save-statement-position");
  setSaveButtonState(false);
  button.mousedown(onSaveStatementPositionClick);
}

function initRemoveStatementPositionButton() {
  const button = $("#remove-statement-position");
  setRemoveButtonState(false);
  button.mousedown(onRemoveStatementPositionClick);
}

function isTextSelected() {
  const range = getSelection();
  if (range !== null && range.rangeCount > 0) {
    const firstRange = range.getRangeAt(0);
    const classes = firstRange.startContainer.parentElement.classList;
    const isPreSelection = classes.contains("pre-selection");
    const isSelection = classes.contains("selection");
    const isPostSelection = classes.contains("post-selection");
    const selectedCount = firstRange.endOffset - firstRange.startOffset;
    return selectedCount > 0 && (isPreSelection || isSelection || isPostSelection);
  }
  return false;
}

function checkSaveButtonState(event) {
  const currentId = storage.getItem("current-id");
  const isStatementSelected = currentId !== null;

  const isTextSelectedVar = isTextSelected();

  const existSavedPositionVar = existSavedPosition(currentId);

  setSaveButtonState(isStatementSelected && isTextSelectedVar && !existSavedPositionVar);
}

function initTextHandlers() {
  let preSelection = $(".pre-selection");
  let selection = $(".selection");
  let postSelection = $(".post-selection");
  let content = $("#content");
  let body = $("body");

  body.click(checkSaveButtonState);

  content.mousemove(checkSaveButtonState);
  content.mousedown(checkSaveButtonState);
  content.click(checkSaveButtonState);
  content.mouseup(checkSaveButtonState);

  preSelection.mousedown(checkSaveButtonState);
  preSelection.click(checkSaveButtonState);
  preSelection.mouseup(checkSaveButtonState);

  selection.mousedown(checkSaveButtonState);
  selection.click(checkSaveButtonState);
  selection.mouseup(checkSaveButtonState);

  postSelection.mousedown(checkSaveButtonState);
  postSelection.click(checkSaveButtonState);
  postSelection.mouseup(checkSaveButtonState);
}

function serializeData() {
  let data = [];
  $(".statement").each(function(index, statement) {
    const id = $(statement).attr("data-statement-id");
    const savedStart = storage.getItem(`${id}-start`);
    const savedEnd = storage.getItem(`${id}-end`);
    const savedStart2 = storage.getItem(`${id}-start2`);
    const savedEnd2 = storage.getItem(`${id}-end2`);
    const savedFragment = storage.getItem(`${id}-fragment`);
    if (savedStart !== null && savedEnd !== null && savedStart2 !== null && savedEnd2 !== null && savedFragment !== null) {
      data.push({
        "id": id,
        "start": savedStart,
        "end": savedEnd,
        "start2": savedStart2,
        "end2": savedEnd2,
        "fragment": savedFragment
      })
    }
  });
  let jsonToSend = JSON.stringify(data);
  console.log(jsonToSend);
  $("#data").attr("value", jsonToSend);
  $("#submit").submit();
}

function initGenerateJsonButton() {
  $("#generate-json").click(function() {
    serializeData();
  })
}

function restoreStatements() {
  const serializedJson = $("#data").attr("value");
  if (serializedJson) {
    const json = JSON.parse(serializedJson);
    _.forEach(json, function (statement) {
      storage.setItem(`${statement.id}-start`, statement.start);
      storage.setItem(`${statement.id}-end`, statement.end);
    });
  }
  reloadStatements();
}

function initHandlers() {
  $(".statement").mousedown(onStatementClick);
  initTextHandlers();
  initSaveStatementPositionButton();
  initRemoveStatementPositionButton();
  initGenerateJsonButton();
}

function onDocumentReady() {
  storage = sessionStorage;
  storage.clear();

  restoreStatements();

  initHandlers();
}

$(document).ready(onDocumentReady);

