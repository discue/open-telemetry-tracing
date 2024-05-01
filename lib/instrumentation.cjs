const { trace, diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api')
const { NodeSDK } = require('@opentelemetry/sdk-node')
const { Resource } = require('@opentelemetry/resources')
const createInstrumentations = require('./tracing/create-instrumentation.cjs')
const createSdkResource = require('./tracing/create-resource-attributes.cjs')
const createTraceExporter = require('./tracing/create-exporter.cjs')
const createSpanProcessor = require('./tracing/create-span-processor.cjs')

const serviceName = process.env.DSQ_OT_TRACING_SERVICE_NAME ?? 'api-kit'
const enableDebugLogging = process.env.DSQ_OT_ENABLE_DEBUG_LOGGING === 'true'

const exporter = createTraceExporter()
const spanProcessor = createSpanProcessor(exporter)

if (enableDebugLogging) {
  // For troubleshooting, set the log level to DiagLogLevel.DEBUG
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG)
}

const sdk = new NodeSDK({
  instrumentations: createInstrumentations(),
  resource: new Resource(createSdkResource()),
  serviceName,
  spanProcessors: [spanProcessor],
  traceExporter: exporter,
})

sdk.start()

process.on('SIGTERM', () => {
  sdk.shutdown()
})

module.exports = trace.getTracer(serviceName)