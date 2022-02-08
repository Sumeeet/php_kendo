const History = function () {
    const HISTORY_SIZE = 10
    const historyMap = new Map()
    let history = []
    let marker = -1

    const doesExist = function () {
        return history.length > 0
    }

    const readCache = function () {
        const length = cacheIndexes.length
        if (length === 0 || marker > length - 1) return false

        return (cacheIndexes[marker])
    }

    const record = function(key, command) {
        if (history.length > HISTORY_SIZE) {
            console.log(`History size exceeded the size of ${HISTORY_SIZE}`)
            return
        }

        const addCommand = (cmd) => {
            marker = marker + 1
            history.splice(marker, 0, cmd)
        }

        if (!historyMap.has(key)) {
            historyMap.set(key, marker)
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
        historyMap.clear()
        marker = -1
    }

    return { record, playBack, playForward, erase }
}