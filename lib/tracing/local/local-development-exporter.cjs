const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')

module.exports = () => {
  return new OTLPTraceExporter({
    url: process.env.DSQ_OT_LOCAL_OLTP_URL ?? 'http://127.0.0.1:4318/v1/traces'
  })
}