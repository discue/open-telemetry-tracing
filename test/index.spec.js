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
            it('creates a span', async () => {
                await retry(async () => {
                    const spans = await fetchSpans({ spanName })

                    const span = spans.find((s) => s.operationName === spanName)
                    expect(span.operationName).to.equal(spanName)
                    const tag = span.tags.find((s) => s.key === 'otel.library.name')
                    expect(tag.value).to.equal('api-kit')
                })
            })

            it('adds attributes to the span', async () => {
                await retry(async () => {
                    const spans = await fetchSpans({ spanName })

                    const span = spans.find((s) => s.operationName === spanName)
                    expect(span.operationName).to.equal(spanName)
                    const tag = span.tags.find((s) => s.key === 'my')
                    expect(tag.value).to.equal('attr')
                })
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
            it('creates a span with a prefix', async () => {
                await retry(async () => {
                    const spans = await fetchSpans({ spanName })

                    const span = spans.find((s) => s.operationName === spanName)
                    expect(span.operationName).to.equal(spanName)
                    const tag = span.tags.find((s) => s.key === 'otel.library.name')
                    expect(tag.value).to.equal('api-kit')
                })
            })
        })

        describe('.withActiveSpanSync', () => {
            const spanName = 'active-sync-handler'
            before(() => {
                return simpleFetch('http://127.0.0.1:4444/active-span-sync')
            })
            it('creates a span', async () => {
                await retry(async () => {
                    const spans = await fetchSpans({ spanName })

                    const span = spans.find((s) => s.operationName === spanName)
                    expect(span.operationName).to.equal(spanName)
                    const tag = span.tags.find((s) => s.key === 'otel.library.name')
                    expect(tag.value).to.equal('api-kit')
                })
            })

            it('adds attributes to the span', async () => {
                await retry(async () => {
                    const spans = await fetchSpans({ spanName })

                    const span = spans.find((s) => s.operationName === spanName)
                    expect(span.operationName).to.equal(spanName)
                    const tag = span.tags.find((s) => s.key === 'my')
                    expect(tag.value).to.equal('attr')
                })
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
            it('creates a span with a prefix', async () => {
                await retry(async () => {
                    const spans = await fetchSpans({ spanName })

                    const span = spans.find((s) => s.operationName === spanName)
                    expect(span.operationName).to.equal(spanName)
                    const tag = span.tags.find((s) => s.key === 'otel.library.name')
                    expect(tag.value).to.equal('api-kit')
                })
            })
        })

        describe('.withOrphanedSpan', () => {
            const spanName = 'orphaned-span-handler'
            before(() => {
                return simpleFetch('http://127.0.0.1:4444/orphaned-span')
            })
            it('creates a span', async () => {
                await retry(async () => {
                    const spans = await fetchSpans({ spanName })

                    const span = spans.find((s) => s.operationName === spanName)
                    expect(span.operationName).to.equal(spanName)
                    const tag = span.tags.find((s) => s.key === 'otel.library.name')
                    expect(tag.value).to.equal('api-kit')
                })
            })

            it('adds attributes to the span', async () => {
                await retry(async () => {
                    const spans = await fetchSpans({ spanName })

                    const span = spans.find((s) => s.operationName === spanName)
                    expect(span.operationName).to.equal(spanName)
                    const tag = span.tags.find((s) => s.key === 'my')
                    expect(tag.value).to.equal('attr')
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
            it('creates a span with a prefix', async () => {
                await retry(async () => {
                    const spans = await fetchSpans({ spanName })

                    const span = spans.find((s) => s.operationName === spanName)
                    expect(span.operationName).to.equal(spanName)
                    const tag = span.tags.find((s) => s.key === 'otel.library.name')
                    expect(tag.value).to.equal('api-kit')
                })
            })
        })
    })
})