const express = require('express')
const { createTracer } = require('../lib/index.js')
const app = express()

const tracer = createTracer('test-server', { filepath: __filename })

app.get('/orphaned-span', async (_, res) => {
    await tracer.withOrphanedSpan('orphaned-span-handler', { my: 'attr' }, () => { })
    res.status(200).send()
})
app.get('/active-span-sync', (_, res) => {
    tracer.withActiveSpanSync('active-sync-handler', { my: 'attr' }, () => { })
    res.status(200).send()
})
app.get('/active-span', async (_, res) => {
    await tracer.withOrphanedSpan('active-handler', { my: 'attr' }, () => { })
    res.status(200).send()
})

module.exports = app.listen(4444, () => {
    console.log('Test server started on port 4444')
})