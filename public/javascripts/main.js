let storage = {};

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
  const savedStart = _.get(storage, `s${id}.start`);
  const savedEnd = _.get(storage, `s${id}.end`);
  return savedStart !== undefined && savedEnd !== undefined;
}

function onStatementClick() {
  const id = $(this).attr("data-statement-id");
  _.set(storage, "current-id", id);

  setSaveButtonState(false);

  const exist = existSavedPosition(id);
  setRemoveButtonState(exist);

  reloadStatements();
}

function reloadStatements() {
  $(".statement").each(function(index, statement) {

    const id = $(statement).attr("data-statement-id");
    const savedStart = _.get(storage, `s${id}.start`);
    const savedEnd = _.get(storage, `s${id}.end`);
    const saveExist = savedStart !== undefined && savedEnd !== undefined;

    if (saveExist) {
      $(statement).addClass("statement-saved");
    } else {
      $(statement).removeClass("statement-saved");
    }

    if (_.get(storage, "current-id") === id) {
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

  const currentId = _.get(storage, "current-id");
  _.set(storage, `s${currentId}.start`, startPositionInOriginal.toString());
  _.set(storage, `s${currentId}.end`, endPositionInOriginal.toString());
  _.set(storage, `s${currentId}.start2`, start2.toString());
  _.set(storage, `s${currentId}.end2`, end2.toString());
  _.set(storage, `s${currentId}.fragment`, fragment);

  setRemoveButtonState(true);

  reloadStatements();
}

function onRemoveStatementPositionClick(event) {
  event.preventDefault();

  const currentId = _.get(storage, "current-id");
  _.unset(storage, `s${currentId}.start`);
  _.unset(storage, `s${currentId}.end`);

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
  const currentId = _.get(storage, "current-id");
  const isStatementSelected = currentId !== undefined;

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
    const savedStart = _.get(storage, `s${id}.start`);
    const savedEnd = _.get(storage, `s${id}.end`);
    const savedStart2 = _.get(storage, `s${id}.start2`);
    const savedEnd2 = _.get(storage, `s${id}.end2`);
    const savedFragment = _.get(storage, `s${id}.fragment`);
    if (savedStart !== undefined && savedEnd !== undefined && savedStart2 !== undefined && savedEnd2 !== undefined && savedFragment !== undefined) {
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
      _.set(storage, `s${statement.id}.start`, statement.start);
      _.set(storage, `s${statement.id}.end`, statement.end);
      _.set(storage, `s${statement.id}.start2`, statement.start2);
      _.set(storage, `s${statement.id}.end2`, statement.end2);
      _.set(storage, `s${statement.id}.fragment`, statement.fragment);
    });
  }
  console.log("boom");
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
  storage = {};
  restoreStatements();
  initHandlers();
}

$(document).ready(onDocumentReady);

