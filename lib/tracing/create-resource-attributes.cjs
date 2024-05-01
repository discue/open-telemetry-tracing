if (process.env.K_REVISION) {
    module.exports = require('./gcp-cloud-run/resource-attributes.cjs')
} else if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
    module.exports = require('./aws-lambda/aws-tracer-provider.cjs')
} else {
    module.exports = require('./local/local-resource-attributes.cjs')
}
