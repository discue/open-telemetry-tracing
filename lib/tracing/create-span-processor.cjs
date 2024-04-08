const { SimpleSpanProcessor, BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base')

if (process.env.DSQ_OT_USE_SIMPLE_SPAN_PROCESSOR) {
    module.exports = (exporter) => new SimpleSpanProcessor(exporter)
} else {
    module.exports = (exporter) => new BatchSpanProcessor(exporter)
}
