if (process.env.K_REVISION) {
    module.exports = require('./gcp-cloud-run/exporter.cjs')
} else {
    module.exports = require('./local/local-development-exporter.cjs')
}
