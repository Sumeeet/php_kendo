const GridActionSubscription = (gid) => {
  const keyup = CT.Observable.fromEvent(getElement(gid), "keyup")
    .map((e) => CT.Utils.makeShortCutKey(e))
    .share();

  const addRow = (eid) => {
    const addRow = new AddRowCommand();
    const click = CT.Observable.fromEvent(getElement(eid), "click").filter(
      (e) => e.button === MOUSE_BUTTON.left
    );

    // TODO: How to pass values to different subscribers ? Use map for now
    // TODO: one way is to compose dependent operations on client side
    const shortcut = keyup.filter(
      (shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.add
    );
    const merged = CT.Observable.merge(click, shortcut)
      .map((e) => addRow(gid))
      .share(); // let all the subscriber listen to same observable

    // lets others listen to this change
    return merged;
  };

  const removeRow = (eid) => {
    const removeRow = new RemoveRowCommand();
    const click = CT.Observable.fromEvent(getElement(eid), "click").filter(
      (e) => e.button === MOUSE_BUTTON.left
    );

    const shortcut = keyup.filter(
      (shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.remove
    );
    const merged = CT.Observable.merge(click, shortcut)
      .map((e) => removeRow(gid))
      .share(); // let all the subscriber listen to same observable

    return merged;
  };

  const undoRow = (eid) => {
    const clickObservable = CT.Observable.fromEvent(
      getElement(eid),
      "click"
    ).filter((e) => e.button === MOUSE_BUTTON.left);

    const undoObservable = keyup.filter(
      (shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.undo
    );
    return CT.Observable.merge(clickObservable, undoObservable).share();
  };

  const redoRow = (eid) => {
    const clickObservable = CT.Observable.fromEvent(
      getElement(eid),
      "click"
    ).filter((e) => e.button === MOUSE_BUTTON.left);

    const undoObservable = keyup.filter(
      (shortCutKey) => shortCutKey === KEYBOARD_SHORTCUTS.redo
    );
    return CT.Observable.merge(clickObservable, undoObservable).share();
  };

  return { addRow, removeRow, undoRow, redoRow };
};
