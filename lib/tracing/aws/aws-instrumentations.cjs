const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express")
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb")
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http")
const { GrpcInstrumentation } = require("@opentelemetry/instrumentation-grpc")
const { DnsInstrumentation } = require("@opentelemetry/instrumentation-dns")
const { FsInstrumentation } = require("@opentelemetry/instrumentation-fs")
const { NetInstrumentation } = require("@opentelemetry/instrumentation-net")
const { PinoInstrumentation } = require("@opentelemetry/instrumentation-pino")
const { AWSLambdaInstrumentation } = require('@opentelemetry/instrumentation-aws-lambda')

// list can be found here 
// https://github.com/open-telemetry/opentelemetry-js-contrib/blob/main/metapackages/auto-instrumentations-node/src/utils.ts
module.exports = () => {
    return [
        new AWSLambdaInstrumentation({
            // https://www.aspecto.io/blog/how-to-use-opentelemetry-with-aws-lambda/
            disableAwsContextPropagation: true
        }),
        new DnsInstrumentation(),
        new ExpressInstrumentation(),
        new FsInstrumentation(),
        new GrpcInstrumentation(), // e.g. google cloud firestore
        new HttpInstrumentation(),
        new MongoDBInstrumentation(),
        new NetInstrumentation(),
        new PinoInstrumentation()
    ]
}