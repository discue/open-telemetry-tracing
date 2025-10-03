const { expect } = require('chai')
const { createTracer, getActiveSpanAndTraceIds } = require('../lib/index.js')
const { fetchSpans } = require('./simple-fetch.js')
const simpleFetch = require('./simple-fetch.js')
const testServer = require('./test-server.js')
const retry = require('./retry.js')

describe('Tracing', () => {
    after(() => {
        return testServer.close()
    })

    describe('.getActiveSpanAndTraceIds', () => {
        it('returns span id if called within active span', (done) => {
            const tracer = createTracer('test')
            tracer.withActiveSpan('withActiveSpan-test-span', (span) => {
                const { spanId } = getActiveSpanAndTraceIds()
                expect(spanId).to.equal(span.spanContext().spanId)
                done()
            })
        })
        it('returns traceId id if called within active span', (done) => {
            const tracer = createTracer('test')
            tracer.withActiveSpan('withActiveSpan-test-span', (span) => {
                const { traceId } = getActiveSpanAndTraceIds()
                expect(traceId).to.equal(span.spanContext().traceId)
                done()
            })
        })
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

            it('returns false if callback returns false', async () => {
                const { withActiveSpan } = createTracer('test')
                const result = await withActiveSpan('withActiveSpan-test-span', () => {
                    return false
                })
                expect(result).to.equal(false)
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
                await assertSpanWithAttributeExists(spanName)
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
    retry(async () => {
        const spans = await fetchSpans({ spanName })

        const span = spans.find((s) => s.operationName === spanName)
        expect(span.operationName).to.equal(spanName)
        const tag = span.tags.find((s) => s.key === 'my')
        expect(tag.value).to.equal('attr')
    })
}
