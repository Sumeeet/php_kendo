const History = function () {
    const HISTORY_SIZE = 10
    // this is kept in order to insert null values for properties
    // null value is only inserted once against each property, this
    // null value is used to check if value should be fetched from the
    // cache.
    const historyMap = new Map()
    let history = []
    let marker = -1

    const doesExist = function () {
        return history.length > 0
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