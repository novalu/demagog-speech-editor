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

function onStatementClick() {
  const id = $(this).attr("data-statement-id");
  storage.setItem("current-id", id);

  setSaveButtonState(false);

  const savedStart = storage.getItem(`${id}-start`);
  const savedEnd = storage.getItem(`${id}-end`);
  const existSave = savedStart !== null && savedEnd !== null;
  setRemoveButtonState(existSave);

  reloadStatementSelection();
}

function reloadStatementSelection() {
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

  const currentId = storage.getItem("current-id");
  storage.setItem(`${currentId}-start`, startPositionInOriginal.toString());
  storage.setItem(`${currentId}-end`, endPositionInOriginal.toString());

  reloadStatementSelection();
}

function onRemoveStatementPositionClick(event) {
  event.preventDefault();

  const currentId = storage.getItem("current-id");
  storage.removeItem(`${currentId}-start`);
  storage.removeItem(`${currentId}-end`);

  setRemoveButtonState(false);

  reloadStatementSelection();
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
    return isPreSelection || isSelection || isPostSelection;
  }
  return false;
}

function onTextMouseUp(event) {
  console.log("yyyyy");
  const currentId = storage.getItem("current-id");
  const isStatementSelected = currentId !== null;

  const isSelected = isTextSelected();

  setSaveButtonState(isStatementSelected && isSelected);
}

function onDeselectText(event) {
  if (!isTextSelected()) {
    setSaveButtonState(false);
  }
}

function onDocumentReady() {
  storage = sessionStorage;
  storage.removeItem("current-id");

  reloadStatementSelection();

  $(".statement").mousedown(onStatementClick);

  $(".pre-selection").mousedown(onDeselectText);
  $(".selection").mousedown(onDeselectText);
  $(".post-selection").mousedown(onDeselectText);
  $(".pre-selection").click(onDeselectText);
  $(".selection").click(onDeselectText);
  $(".post-selection").click(onDeselectText);
  $(".pre-selection").mouseup(onTextMouseUp);
  $(".selection").mouseup(onTextMouseUp);
  $(".post-selection").mouseup(onTextMouseUp);

  initSaveStatementPositionButton();
  initRemoveStatementPositionButton();
}

$(document).ready(onDocumentReady);

