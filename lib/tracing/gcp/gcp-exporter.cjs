const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http")

module.exports = () => {
  return new OTLPTraceExporter({
    url: "http://127.0.0.1:4318/v1/traces"
  })
}