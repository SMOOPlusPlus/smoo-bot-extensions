function gettime() {
    let date = new Date()
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return '[TIME]: ' + ((hour < 10) ? '0' + hour: hour) + ':' + ((minutes < 10) ? '0' + minutes: minutes) + ':' + ((seconds < 10) ? '0' + seconds: seconds)
}

function commandLogs(file, status) {
    console.log(`${gettime()} [COMMAND]: Loaded ${file}, status: ${status}`)
}

function eventLogs(file, status) {
    console.log(`${gettime()} [EVENT]: Loaded ${file}, status: ${status}`)
}

module.exports = { commandLogs, eventLogs, gettime }