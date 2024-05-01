if (process.env.GAE_RUNTIME || process.env.GCLOUD_PROJECT) {
    module.exports = require('./gcp/gcp-resource-attributes.cjs')
} else if (process.env.AWS_REGION) {
    module.exports = require('./aws/aws-tracer-provider.cjs')
} else {
    module.exports = require('./local/local-resource-attributes.cjs')
}
