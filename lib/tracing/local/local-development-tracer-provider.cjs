const { Resource } = require("@opentelemetry/resources")
const { SemanticResourceAttributes, TelemetrySdkLanguageValues } = require("@opentelemetry/semantic-conventions")
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node")
const { platform, version, hostname, arch, type } = require('os')
const { version: serviceVersion } = require('../../../package.json')

module.exports = (serviceName) => {
    return new NodeTracerProvider({
        resource: new Resource({
            [SemanticResourceAttributes.HOST_ARCH]: arch(),
            [SemanticResourceAttributes.HOST_NAME]: hostname(),
            [SemanticResourceAttributes.OS_TYPE]: type(),
            [SemanticResourceAttributes.OS_NAME]: platform(),
            [SemanticResourceAttributes.OS_VERSION]: version(),
            [SemanticResourceAttributes.PROCESS_PID]: process.pid,
            [SemanticResourceAttributes.PROCESS_COMMAND]: process.argv.join(' '),
            [SemanticResourceAttributes.PROCESS_EXECUTABLE_NAME]: 'node',
            [SemanticResourceAttributes.PROCESS_EXECUTABLE_PATH]: process.execPath,
            [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'node',
            [SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: process.version,
            [SemanticResourceAttributes.PROCESS_EXECUTABLE_PATH]: process.execPath,
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
            [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
            [SemanticResourceAttributes.TELEMETRY_SDK_LANGUAGE]: TelemetrySdkLanguageValues.NODEJS,
            [SemanticResourceAttributes.TELEMETRY_SDK_NAME]: "@opentelemetry/sdk-trace-node"
        })
    })
}