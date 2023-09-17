if (process.env.AWS_REGION) {
    module.exports = require('./aws/aws-instrumentations.cjs')
} else {
    module.exports = require('./gcp/gcp-instrumentations.cjs')
}