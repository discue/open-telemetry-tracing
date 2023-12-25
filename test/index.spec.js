const { expect } = require('chai')
const { createTracer } = require('../lib/index.js')
const { fetchSpans } = require('./simple-fetch.js')
const simpleFetch = require('./simple-fetch.js')
const testServer = require('./test-server.js')
const retry = require('./retry.js')

describe('Tracing', () => {
    after(() => {
        return testServer.close()
    })

    describe('.createTracer', () => {
        describe('.withActiveSpan', () => {
            const spanName = 'active-handler'
            before(() => {
                return simpleFetch('http://127.0.0.1:4444/active-span')
            })

            it('adds attributes to the span', async () => {
                await assertSpanWithAttributeExists(spanName)
            })

            it('calls the callback with the span as first attribute', (done) => {
                const tracer = createTracer('test')
                tracer.withActiveSpan('withActiveSpan-test-span', (span) => {
                    try {
                        expect(span.isRecording()).to.be.a('boolean')
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
            })
        })
        describe('.withActiveSpan', () => {
            const spanName = 'api-kit::active-handler'
            before(() => {
                return simpleFetch('http://127.0.0.1:4444/prefix/active-span')
            })
            it('adds attributes to the span', async () => {
                await assertSpanWithAttributeExists(spanName)
            })
        })

        describe('.withActiveSpanSync', () => {
            const spanName = 'active-sync-handler'
            before(() => {
                return simpleFetch('http://127.0.0.1:4444/active-span-sync')
            })

            it('adds attributes to the span', async () => {
                await assertSpanWithAttributeExists(spanName)
            })

            it('calls the callback with the span as first attribute', (done) => {
                const tracer = createTracer('test')
                tracer.withActiveSpanSync('withActiveSpanSync-test-span', (span) => {
                    try {
                        expect(span.isRecording()).to.be.a('boolean')
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
            })
        })
   
        describe('.withActiveSpanSync', () => {
            const spanName = 'api-kit::active-sync-handler'
            before(() => {
                return simpleFetch('http://127.0.0.1:4444/prefix/active-span-sync')
            })
            it('adds attributes to the span', async () => {
                await assertSpanWithAttributeExists(spanName)
            })
        })

        describe('.withOrphanedSpan', () => {
            const spanName = 'orphaned-span-handler'
            before(() => {
                return simpleFetch('http://127.0.0.1:4444/orphaned-span')
            })

            it('adds attributes to the span', async () => {
                await retry(async () => {
                    await assertSpanWithAttributeExists(spanName)
                })
            })

            it('calls the callback with the span as first attribute', (done) => {
                const tracer = createTracer('test')
                tracer.withOrphanedSpan('withOrphanedSpan-test-span', (span) => {
                    try {
                        expect(span.isRecording()).to.be.a('boolean')
                        done()
                    } catch (e) {
                        done(e)
                    }
                })
            })
        })
        
        describe('.withOrphanedSpan', () => {
            const spanName = 'api-kit::orphaned-span-handler'
            before(() => {
                return simpleFetch('http://127.0.0.1:4444/prefix/orphaned-span')
            })
            it('adds attributes to the span', async () => {
                await assertSpanWithAttributeExists(spanName)
            })
        })
    })
})

async function assertSpanWithAttributeExists(spanName) {
    const spans = await fetchSpans({ spanName })

    const span = spans.find((s) => s.operationName === spanName)
    expect(span.operationName).to.equal(spanName)
    const tag = span.tags.find((s) => s.key === 'my')
    expect(tag.value).to.equal('attr')
}
