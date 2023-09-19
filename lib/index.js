const { SpanStatusCode, trace, context } = require('@opentelemetry/api')
const { SemanticAttributes } = require('@opentelemetry/semantic-conventions')
const tracer = require('./instrumentation.cjs')

/**
 * @typedef {import('@opentelemetry/api').Tracer} Tracer
 */

/**
 * @typedef {String|Tracer} StringOrTracer
 */

/**
 * @typedef {import('@opentelemetry/api').Span} Span
 */

/**
 * @callback ActiveSpanCallback
 * @param {Span} span
 */

/**
 * @param {StringOrTracer} tracerNameOrTracer the name of the tracer or the tracer itself
 * @param {String} spanName the name of the span
 * @param {Object} spanAttributes additional metadata for the span
 * @param {ActiveSpanCallback} callback the function to call
 * @returns {Promise}
 */
module.exports.withActiveSpan = async function withActiveSpan(tracerNameOrTracer, spanName, spanAttributes, callback) {
    const tracer = getTracer(tracerNameOrTracer)

    return tracer.startActiveSpan(spanName, async (span) => {
        setSpanAttributes(span, spanAttributes)

        try {
            let result = callback(span)
            if (result?.finally) {
                result = await result
            }
            return result
        } catch (e) {
            handleException(span, e)
            throw e
        } finally {
            span.end()
        }
    })
}

/**
 * 
 * @param {StringOrTracer} tracerNameOrTracer the name of the tracer or the tracer itself
 * @returns {Tracer}
 */
function getTracer(tracerNameOrTracer) {
    let tracer = tracerNameOrTracer
    if (typeof tracerName === 'string') {
        tracer = trace.getTracer(tracerNameOrTracer)
    }
    return tracer
}

/**
 * 
 * @param {Span} span 
 * @param {Error} e 
 */
function handleException(span, e) {
    span.recordException(e)
    span.setStatus({
        code: SpanStatusCode.ERROR,
        message: e.message
    })
}

/**
 * 
 * @param {Span} span 
 * @param {Object} spanAttributes 
 */
function setSpanAttributes(span, spanAttributes) {
    Object.entries(spanAttributes).forEach(([key, value]) => {
        if (value) {
            span.setAttribute(key, value)
        }
    })
}

/**
 * @param {StringOrTracer} tracerNameOrTracer the name of the tracer or the tracer itself
 * @param {String} spanName the name of the span
 * @param {Object} spanAttributes additional metadata for the span
 * @param {ActiveSpanCallback} callback the function to call
 * @returns {any}
 */
module.exports.withActiveSpanSync = function withActiveSpanSync(tracerNameOrTracer, spanName, spanAttributes, callback) {
    const span = createNewSpan(tracerNameOrTracer, spanName, spanAttributes)

    try {
        const result = context.with(context.active(), () => callback(span))
        return result
    } catch (e) {
        handleException(span, e)
        throw e
    } finally {
        span.end()
    }
}

/**
 * 
 * @param {StringOrTracer} tracerNameOrTracer the name of the tracer or the tracer itself
 * @param {String} spanName the name of the span
 * @param {Object} spanAttributes additional metadata for the span
 * @param {ActiveSpanCallback} callback the function to call
 * @returns {Promise}
 */
module.exports.withOrphanedSpan = async function withOrphanedSpan(tracerNameOrTracer, spanName, spanAttributes, callback) {
    const span = createNewSpan(tracerNameOrTracer, spanName, spanAttributes)

    try {
        let result = callback(span)
        if (result?.finally) {
            result = await result
        }
        return result
    } catch (e) {
        handleException(span, e)
        throw e
    } finally {
        span.end()
    }
}

/**
 * @callback WithActiveSpanFn
 * @param {String} spanName the name of the span
 * @param {Object|ActiveSpanCallback} [spanAttributes] additional attributes for the span
 * @param {ActiveSpanCallback} [callback] the function to call
 */

/**
 * @typedef TracerFacade
 * @property {WithActiveSpanFn} withActiveSpan
 * @property {WithActiveSpanFn} withActiveSpanSync
 * @property {WithActiveSpanFn} withOrphanedSpan
 */

/**
 * @typedef CreateTracerOptions
 * @property {String} [version] the version of the tracer
 * @property {String} [filepath] the filename of the traced functions. For es6 modules use import.meta.url, for CommonJS use `${__dirname}/${__filename}`
 */

/**
 * 
 * @param {CreateTracerOptions} [options] 
 * @returns {TracerFacade}
 */
module.exports.createTracer = function createTracer({ filepath } = {}) {
    return {
        /**
         * 
         * @param {String} spanName the name of the span
         * @param {Object} [spanAttributes] additional attributes to attach to the span
         * @param {ActiveSpanCallback} callback the function to call
         */
        withActiveSpan: async (spanName, spanAttributes, callback) => {
            const { attributes, callback: actualCallback } = prepareAttributes(spanAttributes, filepath, callback)
            return module.exports.withActiveSpan(tracer, spanName, attributes, actualCallback)
        },
        /**
         * 
         * @param {String} spanName the name of the span
         * @param {Object} [spanAttributes] additional attributes to attach to the span
         * @param {ActiveSpanCallback} callback the function to call
         */
        withActiveSpanSync: (spanName, spanAttributes, callback) => {
            const { attributes, callback: actualCallback } = prepareAttributes(spanAttributes, filepath, callback)
            return module.exports.withActiveSpanSync(tracer, spanName, attributes, actualCallback)
        },
        /**
         * 
         * @param {String} spanName the name of the span
         * @param {Object} [spanAttributes] additional attributes to attach to the span
         * @param {ActiveSpanCallback} callback the function to call
         */
        withOrphanedSpan: async (spanName, spanAttributes, callback) => {
            const { attributes, callback: actualCallback } = prepareAttributes(spanAttributes, filepath, callback)
            return module.exports.withOrphanedSpan(tracer, spanName, attributes, actualCallback)
        }
    }
}

/**
 * 
 * @param {StringOrTracer} tracerNameOrTracer the name of the tracer or the tracer itself
 * @param {String} spanName 
 * @param {Object} spanAttributes 
 * @returns {Span}
 */
function createNewSpan(tracerNameOrTracer, spanName, spanAttributes) {
    const tracer = getTracer(tracerNameOrTracer)
    const span = tracer.startSpan(spanName)
    setSpanAttributes(span, spanAttributes)
    return span
}

/**
 * 
 * @param {Object|Function} [spanAttributes] 
 * @param {String} filepath 
 * @param {Function} [callback] 
 * @returns 
 */
function prepareAttributes(spanAttributes, filepath, callback) {
    if (!callback && typeof spanAttributes === 'function') {
        callback = spanAttributes
        spanAttributes = {}
    }
    const attributes = Object.assign({}, spanAttributes, {
        [SemanticAttributes.CODE_FILEPATH]: filepath ?? 'unknown'
    })
    return { attributes, callback }
}