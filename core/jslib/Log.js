const Log = (message) => {
    return console.log(message)
}

const EventLogs = function(command) {

}

const Message = (type, source, message) => {
    const date = new Date()
    const day = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}`
    const time = `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`

    return {
        type: () => type,
        source: () => source,
        message: () => message,
        toString: () => `${day} ${time} [${type}] ${source} ${message}`
    }
}