const { trace } = require('@opentelemetry/api')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const createInstrumentations = require('./tracing/create-instrumentation.cjs')
const createTracerProvider = require('./tracing/create-tracer-provider.cjs')
const createTraceExporter = require('./tracing/create-exporter.cjs')
const createSpanProcessor = require('./tracing/create-span-processor.cjs')

const serviceName = process.env.DSQ_OT_TRACING_SERVICE_NAME ?? 'api-kit'

const exporter = createTraceExporter()
const tracerProvider = createTracerProvider(serviceName)

tracerProvider.addSpanProcessor(createSpanProcessor(exporter))
tracerProvider.register()

registerInstrumentations({
  instrumentations: createInstrumentations(),
  tracerProvider,
})

process.on('SIGTERM', () => {
  exporter.shutdown()
  tracerProvider.shutdown()
})

module.exports = trace.getTracer(serviceName)