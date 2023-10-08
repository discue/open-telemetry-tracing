const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');

module.exports = () => {
  return new TraceExporter()
}