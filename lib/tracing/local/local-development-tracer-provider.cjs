const { Resource } = require('@opentelemetry/resources')
const { SEMRESATTRS_HOST_ARCH, SEMRESATTRS_HOST_NAME, SEMRESATTRS_OS_TYPE, SEMRESATTRS_OS_NAME, SEMRESATTRS_OS_VERSION, SEMRESATTRS_PROCESS_PID, SEMRESATTRS_PROCESS_COMMAND, SEMRESATTRS_PROCESS_EXECUTABLE_NAME, SEMRESATTRS_PROCESS_EXECUTABLE_PATH, SEMRESATTRS_PROCESS_RUNTIME_NAME, SEMRESATTRS_PROCESS_RUNTIME_VERSION, SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION, TELEMETRYSDKLANGUAGEVALUES_NODEJS, SEMRESATTRS_TELEMETRY_SDK_LANGUAGE, SEMRESATTRS_TELEMETRY_SDK_NAME } = require('@opentelemetry/semantic-conventions')
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const { platform, version, hostname, arch, type } = require('os')
const { version: serviceVersion, name } = require('../../../package.json')

module.exports = (serviceName) => {
    return new NodeTracerProvider({
        resource: new Resource({
            [SEMRESATTRS_HOST_ARCH]: arch(),
            [SEMRESATTRS_HOST_NAME]: hostname(),
            [SEMRESATTRS_OS_TYPE]: type(),
            [SEMRESATTRS_OS_NAME]: platform(),
            [SEMRESATTRS_OS_VERSION]: version(),
            [SEMRESATTRS_PROCESS_PID]: process.pid,
            [SEMRESATTRS_PROCESS_COMMAND]: process.argv.join(' '),
            [SEMRESATTRS_PROCESS_EXECUTABLE_NAME]: 'node',
            [SEMRESATTRS_PROCESS_EXECUTABLE_PATH]: process.execPath,
            [SEMRESATTRS_PROCESS_RUNTIME_NAME]: 'node',
            [SEMRESATTRS_PROCESS_RUNTIME_VERSION]: process.version,
            [SEMRESATTRS_SERVICE_NAME]: serviceName,
            [SEMRESATTRS_SERVICE_VERSION]: serviceVersion,
            [SEMRESATTRS_TELEMETRY_SDK_LANGUAGE]: TELEMETRYSDKLANGUAGEVALUES_NODEJS,
            [SEMRESATTRS_TELEMETRY_SDK_NAME]: name
        })
    })
}