"use strict";

var storage = {};

function setSaveButtonState(state) {
  var button = $("#save-statement-position");
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
  var button = $("#remove-statement-position");
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
  var savedStart = _.get(storage, "s" + id + ".start");
  var savedEnd = _.get(storage, "s" + id + ".end");
  return savedStart !== undefined && savedEnd !== undefined;
}

function onStatementClick() {
  var id = $(this).attr("data-statement-id");
  _.set(storage, "current-id", id);

  setSaveButtonState(false);

  var exist = existSavedPosition(id);
  setRemoveButtonState(exist);

  reloadStatements();
}

function reloadStatements() {
  $(".statement").each(function (index, statement) {

    var id = $(statement).attr("data-statement-id");
    var savedStart = _.get(storage, "s" + id + ".start");
    var savedEnd = _.get(storage, "s" + id + ".end");
    var saveExist = savedStart !== undefined && savedEnd !== undefined;

    if (saveExist) {
      $(statement).addClass("statement-saved");
    } else {
      $(statement).removeClass("statement-saved");
    }

    if (_.get(storage, "current-id") === id) {
      $(statement).addClass("statement-selected");

      var originalText = $("#speech-original").text();

      var preSelectionElem = $(".pre-selection").first();
      var selectionElem = $(".selection").first();
      var postSelectionElem = $(".post-selection").first();

      if (saveExist) {
        var preSelectionText = originalText.substring(0, savedStart);
        preSelectionElem.text(preSelectionText);

        var selectionText = originalText.substring(savedStart, savedEnd);
        selectionElem.text(selectionText);

        var postSelectionText = originalText.substring(savedEnd, originalText.length);
        postSelectionElem.text(postSelectionText);
      } else {
        preSelectionElem.text(originalText);
        selectionElem.text("");
        postSelectionElem.text("");
      }
    } else {
      $(statement).removeClass("statement-selected");
    }
  });
}

function onSaveStatementPositionClick(event) {
  event.preventDefault();

  var range = getSelection().getRangeAt(0);
  var start = range.startOffset;
  var end = range.endOffset;
  var classes = range.startContainer.parentElement.classList;
  var isPreSelection = classes.contains("pre-selection");
  var isSelection = classes.contains("selection");
  var isPostSelection = classes.contains("post-selection");

  var startPositionInOriginal = 0;
  if (isPreSelection) {
    startPositionInOriginal = start;
  } else if (isSelection) {
    startPositionInOriginal = $(".pre-selection").text().toString().length + start;
  } else if (isPostSelection) {
    startPositionInOriginal = $(".pre-selection").text().toString().length + $(".selection").text().toString().length + start;
  }
  var endPositionInOriginal = startPositionInOriginal + (end - start);

  var originalText = $("#speech-original").text().toString();
  var rnOccurrencesToStart = (originalText.substr(0, startPositionInOriginal).match(new RegExp("\n|\r", "g")) || []).length;
  var start2 = startPositionInOriginal + rnOccurrencesToStart;
  var rnOccurrencesToEnd = (originalText.substr(0, endPositionInOriginal).match(new RegExp("\n|\r", "g")) || []).length;
  var end2 = endPositionInOriginal + rnOccurrencesToEnd;

  var fragment = originalText.substr(startPositionInOriginal, endPositionInOriginal - startPositionInOriginal);

  var currentId = _.get(storage, "current-id");
  _.set(storage, "s" + currentId + ".start", startPositionInOriginal.toString());
  _.set(storage, "s" + currentId + ".end", endPositionInOriginal.toString());
  _.set(storage, "s" + currentId + ".start2", start2.toString());
  _.set(storage, "s" + currentId + ".end2", end2.toString());
  _.set(storage, "s" + currentId + ".fragment", fragment);

  setRemoveButtonState(true);

  reloadStatements();
}

function onRemoveStatementPositionClick(event) {
  event.preventDefault();

  var currentId = _.get(storage, "current-id");
  _.unset(storage, "s" + currentId + ".start");
  _.unset(storage, "s" + currentId + ".end");

  setRemoveButtonState(false);

  reloadStatements();
}

function initSaveStatementPositionButton() {
  var button = $("#save-statement-position");
  setSaveButtonState(false);
  button.mousedown(onSaveStatementPositionClick);
}

function initRemoveStatementPositionButton() {
  var button = $("#remove-statement-position");
  setRemoveButtonState(false);
  button.mousedown(onRemoveStatementPositionClick);
}

function isTextSelected() {
  var range = getSelection();
  if (range !== null && range.rangeCount > 0) {
    var firstRange = range.getRangeAt(0);
    var classes = firstRange.startContainer.parentElement.classList;
    var isPreSelection = classes.contains("pre-selection");
    var isSelection = classes.contains("selection");
    var isPostSelection = classes.contains("post-selection");
    var selectedCount = firstRange.endOffset - firstRange.startOffset;
    return selectedCount > 0 && (isPreSelection || isSelection || isPostSelection);
  }
  return false;
}

function checkSaveButtonState(event) {
  var currentId = _.get(storage, "current-id");
  var isStatementSelected = currentId !== undefined;

  var isTextSelectedVar = isTextSelected();

  var existSavedPositionVar = existSavedPosition(currentId);

  setSaveButtonState(isStatementSelected && isTextSelectedVar && !existSavedPositionVar);
}

function initTextHandlers() {
  var preSelection = $(".pre-selection");
  var selection = $(".selection");
  var postSelection = $(".post-selection");
  var content = $("#content");
  var body = $("body");

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
  var data = [];
  $(".statement").each(function (index, statement) {
    var id = $(statement).attr("data-statement-id");
    var savedStart = _.get(storage, "s" + id + ".start");
    var savedEnd = _.get(storage, "s" + id + ".end");
    var savedStart2 = _.get(storage, "s" + id + ".start2");
    var savedEnd2 = _.get(storage, "s" + id + ".end2");
    var savedFragment = _.get(storage, "s" + id + ".fragment");
    if (savedStart !== undefined && savedEnd !== undefined && savedStart2 !== undefined && savedEnd2 !== undefined && savedFragment !== undefined) {
      data.push({
        "id": id,
        "start": savedStart,
        "end": savedEnd,
        "start2": savedStart2,
        "end2": savedEnd2,
        "fragment": savedFragment
      });
    }
  });
  var jsonToSend = JSON.stringify(data);
  $("#data").attr("value", jsonToSend);
  $("#submit").submit();
}

function initGenerateJsonButton() {
  $("#generate-json").click(function () {
    serializeData();
  });
}

function restoreStatements() {
  var serializedJson = $("#data").attr("value");
  if (serializedJson) {
    var json = JSON.parse(serializedJson);
    _.forEach(json, function (statement) {
      _.set(storage, "s" + statement.id + ".start", statement.start);
      _.set(storage, "s" + statement.id + ".end", statement.end);
      _.set(storage, "s" + statement.id + ".start2", statement.start2);
      _.set(storage, "s" + statement.id + ".end2", statement.end2);
      _.set(storage, "s" + statement.id + ".fragment", statement.fragment);
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
//# sourceMappingURL=main.js.map