const { trace, diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api')
const { NodeSDK } = require('@opentelemetry/sdk-node')
const { emptyResource, resourceFromAttributes } = require('@opentelemetry/resources')
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
  autoDetectResources: true,
  instrumentations: createInstrumentations(),
  resource: resourceFromAttributes(createSdkResource()),
  serviceName,
  spanProcessors: [spanProcessor],
  traceExporter: exporter,
})

sdk.start()

process.on('SIGTERM', () => {
  // manually flushing here to be on the safe side
  spanProcessor.forceFlush && spanProcessor.forceFlush()
  exporter.forceFlush && exporter.forceFlush()
  // then shutdown
  sdk.shutdown()
})

module.exports = trace.getTracer(serviceName)