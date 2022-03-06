const UndoRedo = function() {
    const undoMap = new Map()

    const isEmpty = function() {
        return undoMap.size === 0
    }

    const push = function(key, cmd) {
        if (undoMap.has(key)) {
            const history = undoMap.get(key)
            history.record(cmd)
            return
        }

        const history = new History()
        history.record(cmd)
        undoMap.set(key, history)
    }

    const clear = function() {
        undoMap.forEach(history => history.erase())
        undoMap.clear()
    }

    const undo = function(prop) {
        if (isEmpty()) return null
        const history = undoMap.get(prop)
        history.playBack()
    }

    const redo = function(prop) {
        if (isEmpty()) return null
        const history = undoMap.get(prop)
        history.playForward()
    }

    return { push, clear, undo, redo }
}

const History = function () {
    const HISTORY_SIZE = 10
    let history = []
    let marker = -1
    let overwrite = false

    const doesExist = function () {
        return history.length > 0
    }

    const record = function(command) {
        if (history.length > HISTORY_SIZE) {
            if (!overwrite) {
                console.log(`History size exceeded the size of ${HISTORY_SIZE},
                doing Undo one more time will overwrite the last recorded value`)
                overwrite = true
                return
            }
        }

        if (overwrite) {
            marker = HISTORY_SIZE - 1
            overwrite = false
        }

        const addCommand = (cmd) => {
            marker = marker + 1
            history.splice(marker, 0, cmd)
        }

        if (!doesExist()) {
            addCommand(null)
        }
        addCommand(command)
    }

    const canLookBack = function (index) {
        return doesExist() && index >= 0
    }

    const canLookForward = function (index) {
        const size = history.length
        return doesExist() && index < size
    }

    const peekInHistory = function (index) {
        return history[index]
    }

    const playBack = function () {
        let index = marker - 1
        if (!canLookBack(index)) return

        let readCache = false
        let cmd = peekInHistory(index)
        if (cmd === null) {
            cmd = peekInHistory(marker)
            readCache = true
            index = index - 1
        }
        cmd.execute(readCache)
        marker = index
    }

    const playForward = function () {
        let index = marker + 1
        if (!canLookForward(index)) return

        let cmd = peekInHistory(index)
        if (cmd === null) {
            // skip null values
            index = index + 1
            cmd = peekInHistory(index)
        }
        cmd.execute(false)
        marker = index
    }

    const erase = function () {
        history = []
        marker = -1
    }

    return { record, playBack, playForward, erase }
}