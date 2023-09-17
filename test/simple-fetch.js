const http = require('http')

module.exports = function (url) {
    return new Promise((resolve, reject) => {
        const request = http.get(url, (res) => {

            let data = ''

            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('error', (e) => {
                reject(e)
            })
            res.on('close', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Received status ${res.statusCode} with body ${data}`))
                } else {
                    resolve(data ? JSON.parse(data) : null)
                }
            })
        })

        request.end()
    })
}

module.exports.fetchSpans = async function ({ spanName }) {
    const url = `http://localhost:16686/api/traces?&limit=20&lookback=1h&maxDuration&minDuration&operation=${spanName}&service=api-kit&start=${Date.now() - 250}`
    const data = await module.exports(url)
    return data.data.at(0).spans
}