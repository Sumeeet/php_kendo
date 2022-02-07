const UndoRedo = function() {
    const undoMap = new Map()
    let historyKey = ''

    const isEmpty = function() {
        return undoMap.size === 0
    }

    const push = function(key, cmd) {
        if (undoMap.has(key)) {
            const history = undoMap.get(key)
            history.record(cmd)
            return
        }

        historyKey = key
        const history = new History()
        history.record(cmd)
        undoMap.set(key, history)
    }

    const clear = function() {
        undoMap.forEach(history => history.erase())
        undoMap.clear()
    }

    const undo = function() {
        if (isEmpty()) return null
        const history = undoMap.get(historyKey)
        history.playBack()
    }

    const redo = function() {
        if (isEmpty()) return null
        const history = undoMap.get(historyKey)
        history.playForward()
    }

    return { push, clear, undo, redo }
}

const History = function () {
    const HISTORY_SIZE = 100
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
                doing Undo one more time will overwrite history, starting from oldest to newest`)
                overwrite = true
                return
            }
        }

        if (overwrite) {
            // user agrees to overwrite, set marker to beginning of history
            marker = 1
            overwrite = false
        }

        const recordCmd  = (cmd) => {
            marker = marker + 1
            history.splice(marker, 0, cmd)
        }

        if (!doesExist()) {
            recordCmd(Object.create(command))
        }
        recordCmd(command)
    }

    const playBack = function () {
        if (!doesExist() || marker < 0) return
        marker = marker - 1

        if (marker < 0) {
            marker = 0
            return
        }
        const readCache = (marker === 0)
        const cmd = history[marker]
        cmd.execute(readCache)
    }

    const playForward = function () {
        const size = history.length - 1
        if (!doesExist() || marker > size) return
        marker = marker + 1

        if (marker > size) {
            marker = size
            return
        }
        const cmd = history[marker]
        cmd.execute(false)
    }

    const erase = function () {
        history = []
        marker = -1
    }

    return { record, playBack, playForward, erase }
}