const express = require('express')
const { createTracer } = require('../lib/index.js')
const app = express()

const tracer = createTracer({ filepath: __filename })
const prefixTracer = createTracer({ filepath: __filename, spanPrefix: 'api-kit', spanPrefixDelimiter: '::' })

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

app.get('/prefix/orphaned-span', async (_, res) => {
    await prefixTracer.withOrphanedSpan('orphaned-span-handler', { my: 'attr' }, () => { })
    res.status(200).send()
})
app.get('/prefix/active-span-sync', (_, res) => {
    prefixTracer.withActiveSpanSync('active-sync-handler', { my: 'attr' }, () => { })
    res.status(200).send()
})
app.get('/prefix/active-span', async (_, res) => {
    await prefixTracer.withOrphanedSpan('active-handler', { my: 'attr' }, () => { })
    res.status(200).send()
})

module.exports = app.listen(4444, () => {
    console.log('Test server started on port 4444')
})