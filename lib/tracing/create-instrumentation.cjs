if (process.env.AWS_REGION) {
    module.exports = require('./aws-lambda/instrumentations.cjs')
} else {
    module.exports = require('./gcp-cloud-run/instrumentations.cjs')
}