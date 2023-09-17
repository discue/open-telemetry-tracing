if (process.env.GAE_RUNTIME || process.env.GCLOUD_PROJECT) {
    module.exports = require('./gcp/gcp-exporter.cjs')
} else if (process.env.AWS_REGION) {
    //
} else {
    module.exports = require('./local/local-development-exporter.cjs')
}
