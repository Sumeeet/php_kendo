const UndoRedo = function (itemType = UNDO_REDO_ITEMS.value) {
  const undoMap = new Map();

  const isEmpty = function () {
    return undoMap.size === 0;
  };

  const push = function (prop, cmd) {
    if (undoMap.has(prop)) {
      const history = undoMap.get(prop);
      history.record(cmd);
      return;
    }

    const history = new History(itemType);
    history.record(cmd);
    undoMap.set(prop, history);
  };

  const clear = function () {
    undoMap.forEach((history) => history.erase());
    undoMap.clear();
  };

  const undo = function (prop) {
    if (isEmpty()) return null;

    if (!undoMap.has(prop)) {
      Log(
        Message(
          MESSAGE_TYPE.error,
          "client",
          `Property doesn't exist: ${prop}`
        ).toString()
      );
      return;
    }

    const history = undoMap.get(prop);
    history.playBack();
  };

  const redo = function (prop) {
    if (isEmpty()) return null;

    if (!undoMap.has(prop)) {
      Log(
        Message(
          MESSAGE_TYPE.error,
          "client",
          `Property doesn't exist: ${prop}`
        ).toString()
      );
      return;
    }

    const history = undoMap.get(prop);
    history.playForward();
  };

  const canUndo = function (prop) {
    if (isEmpty()) return null;

    if (!undoMap.has(prop)) {
      Log(
        Message(
          MESSAGE_TYPE.error,
          "client",
          `Property doesn't exist: ${prop}`
        ).toString()
      );
      return;
    }

    const history = undoMap.get(prop);
    history.canLookBack();
  };

  const canRedo = function (prop) {
    if (isEmpty()) return null;

    if (!undoMap.has(prop)) {
      Log(
        Message(
          MESSAGE_TYPE.error,
          "client",
          `Property doesn't exist: ${prop}`
        ).toString()
      );
      return;
    }

    const history = undoMap.get(prop);
    history.canLookForward();
  };

  return { push, clear, undo, redo, canUndo, canRedo };
};

const History = function (itemType) {
  const HISTORY_SIZE = 100;
  let history = [];
  let marker = -1;

  const doesExist = function () {
    return history.length > 0;
  };

  const record = function (command) {
    if (history.length > HISTORY_SIZE) {
      Log(
        Message(
          MESSAGE_TYPE.info,
          "client",
          `History is full, last value shall be overwritten.
            To avoid loss of data, please apply changes`
        )
      );
      marker = HISTORY_SIZE - 1;
    }

    const addCommand = (cmd) => {
      marker = marker + 1;
      history.splice(marker, history.length - marker, cmd);
    };

    if (!doesExist()) {
      addCommand(null);
    }
    addCommand(command);
  };

  const canLookBack = function () {
    let index = marker - itemType;
    return doesExist() && index >= 0;
  };

  const canLookForward = function () {
    let index = marker + 1;
    const size = history.length;
    return size > 0 && index < size;
  };

  const peekInHistory = function (index) {
    return history[index];
  };

  const playBack = function () {
    if (!canLookBack()) return;

    // if item type is values then wen need to apply previous value
    // on every undo operation. If it's a command, then it should be played
    // in order. itemType = 0 is for value and 1 for command
    let index = marker - itemType;
    let readCache = false;
    let cmd = peekInHistory(index);
    if (cmd === null) {
      cmd = peekInHistory(marker);
      readCache = true;
    }

    // this check is needed to handle command case, for value type it will
    // return when canLookBack is called
    if (cmd) {
      cmd.execute(readCache);
      marker = marker - 1;
    }
  };

  const playForward = function () {
    if (!canLookForward()) return;

    let index = marker + 1;
    let cmd = peekInHistory(index);
    cmd.execute(false);
    marker = index;
  };

  const erase = function () {
    history = [];
    marker = -1;
  };

  return { record, playBack, playForward, erase, canLookBack, canLookForward };
};
