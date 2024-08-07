
<p align="center">
<a href="https://www.discue.io/" target="_blank" rel="noopener noreferrer"><img width="128" src="https://www.discue.io/icons-fire-no-badge-square/web/icon-192.png" alt="Vue logo">
</a>
</p>

<br/>
<div align="center">

[![GitHub tag](https://img.shields.io/github/tag/discue/open-telemetry-tracing?include_prereleases=&sort=semver&color=blue)](https://github.com/discue/open-telemetry-tracing/releases/)
[![Latest Stable Version](https://img.shields.io/npm/v/@discue/open-telemetry-tracing.svg)](https://www.npmjs.com/package/@discue/open-telemetry-tracing)
[![License](https://img.shields.io/npm/l/@discue/open-telemetry-tracing.svg)](https://www.npmjs.com/package/@discue/open-telemetry-tracing)
<br/>
[![NPM Downloads](https://img.shields.io/npm/dt/@discue/open-telemetry-tracing.svg)](https://www.npmjs.com/package/@discue/open-telemetry-tracing)
[![NPM Downloads](https://img.shields.io/npm/dm/@discue/open-telemetry-tracing.svg)](https://www.npmjs.com/package/@discue/open-telemetry-tracing)
<br/>
[![contributions - welcome](https://img.shields.io/badge/contributions-welcome-blue)](/CONTRIBUTING.md "Go to contributions doc")
[![Made with Node.js](https://img.shields.io/badge/Node.js->=18-blue?logo=node.js&logoColor=white)](https://nodejs.org "Go to Node.js homepage")

</div>

# open-telemetry-tracing
Kickstarts your [OpenTelemetry](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/) implementation with first-class abstractions for
- adding tracing capabilities to NodeJS environments
- collecting and publishing of spans to local and cloud environments
- creating spans and child spans
- tracking successful completion of spans
- recording exceptions in case of errors during span execution

![Screenshot of traces collected by Jaeger.](traces.png)

## Setup
[OpenTelemetry](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/) and its [Instrumentations](https://opentelemetry.io/docs/instrumentation/js/libraries/) will inject tracing functionality into well-known and supported packages. 

To enable tracing, the tracing runtime needs to be loaded **before** your application. To do so, set the `NODE_OPTIONS` environment variable and `require` the file `node_modules/@discue/open-telemetry-tracing/lib/instrumentation.cjs`, which is the entry point for tracing.
- `NODE_OPTIONS=--require node_modules/@discue/open-telemetry-tracing/lib/instrumentation.cjs`

## Instrumentation
[Instrumentations](https://opentelemetry.io/docs/instrumentation/js/libraries/) are the heart of tracing. Most of the tracing instrumentation is platform-agnostic. However, some parts of it can be platform-dependent.

This module features support for GCP and half-baked support for AWS (due to lack of usage of the platform in other projects). You can find the default instrumentations here:
- [Amazon Web Services](lib/tracing/aws-lambda/aws-instrumentations.cjs)
- [Google Cloud Run](lib/tracing/gcp-cloud-run/gcp-instrumentations.cjs)
- [Localhost / Development](lib/tracing/gcp-cloud-run/gcp-instrumentations.cjs)

If you feel instrumentations (or other features) are missing, please get in touch with us and / or open a PR 🙂.

## How to create a span

Import the function `createTracer` function.
```js
import { createTracer } from '@discue/open-telemetry-tracing';
```

Call the function `createTracer` and pass the `filepath` to the current file as an optional parameter.
```js
const { withActiveSpan } = createTracer({
    filepath: import.meta.url
})
```

Wrap existing or new code inside a call to `withActiveSpan`. You can add `spanEvents` to add additional information for later analysis.
```js
/**
 * 
 * @param {_types.Request} req 
 * @param {_types.Response} res 
 * @param {Object} options
 * @returns 
 */
async handleRequest(req, res, { resourceIds }) {
    // creates a new active span with name handle-delete-request
    // will watch execution and record failures
    //
    // pass an object with additional attributes as second parameter
    // to get more key value pairs added to the span
    await withActiveSpan('handle-delete-request', async (span) => {
        const resource = await this._service.get(resourceIds)
        if (resource == null) {
            // custom extension of the span with implementation-specific
            // event and status
            span.addEvent('Not found', { resourceIds })
                .setStatus({ code: SpanStatusCode.ERROR })

            return sendNotFound(res)
        } else {
            await this._service.delete(resourceIds)
            sendOk({ req, res, body: {}, links: {} })
        }
    })
}
```

See a full implementation e.g. in [@stfsy/api-kit/http-post-resource-endpoint](https://github.com/stfsy/node-api-kit/blob/main/lib/endpoints/http-post-resource-endpoint.js).

## How to create a span synchronously
To wrap a synchronous function inside a span, use the `withActiveSpanSync` method. It also accepts a `spanAttributes` object as optional second parameter.

```js
import { createTracer } from '@discue/open-telemetry-tracing';
import { nanoid } from "nanoid";

const { withActiveSpanSync } = createTracer({
    filepath: import.meta.url
})

/**
 * Creates a url-safe resource id.
 * 
 * @module newResourceId
 * @returns {String}
 */
export const newResourceId = () => {
    // wrap the sync call in a span and return the value
    // that way the tracing is transparent for all callers
    return withActiveSpanSync('create-resource-id', () => {
        return nanoId()
    })
}
```

See a full implementation e.g. in [@stfsy/api-kit/resource-id](https://github.com/stfsy/node-api-kit/blob/main/lib/util/resource-id.js).


## How to create an orphaned span
That is a span that has no parent. Useful if you want to prevent deep nesting of spans. To create an orphan span call the `withOrphanedSpan` method of the module. The `spanAttributes` object is optional and can be omitted.

```js
import { createTracer } from '@discue/open-telemetry-tracing';
import { SpanStatusCode } from '@opentelemetry/api';

const { withOrphanedSpan } = createTracer({
    filepath: import.meta.url
})

const { method, headers } = request
const incomingContentType = headers['content-type'] ?? ''
const spanAttributes = { method, incomingContentType }

// checks whether the content type is set
// sets span status accordingly
// adds content-type as a span attribute so it can be queried via UI e.g. Jaeger
await withOrphanedSpan('check-content-type-is-set', spanAttributes, (span) => {
    if (!incomingContentType ) {
        span.addEvent('Check failed').setStatus({ code: SpanStatusCode.ERROR })
        return sendUnsupportedMedia(response)

    } else {
        span.addEvent('Check succeeded').setStatus({ code: SpanStatusCode.OK })
    }

    return nextFunction()
})
```

See a full implementation e.g. in [@stfsy/api-kit/content-type-middleware](https://github.com/stfsy/node-api-kit/blob/main/lib/middlewares/content-type.js).

## Configuration
The following environment variables can be set:
- `DSQ_OT_TRACING_SERVICE_NAME` 
  - default: api-kit
- `DSQ_OT_LOCAL_OLTP_URL`
  - default: http://127.0.0.1:4318/v1/traces
  - note:  for cloud environments automatically, this library will configure the right exporter
- `DSQ_OT_USE_SIMPLE_SPAN_PROCESSOR`
  - default: false
- `DSQ_OT_ENABLE_DEBUG_LOGGING`
  - default: false

## Exports
- **/**: The main export is the `createTracer` function. Import it via `@discue/open-telemetry-tracing` to create traces as shown above. 
- **/status-codes**: Returns valid status codes a span can have. Use this expor to not couple your application to the Open Telemetry libraries. Use it via `@discue/open-telemetry-tracing/status-codes`.
- **/instrumentation**: The `instrumentation` script needs to be loaded via `NODE_OPTIONS` function. This export is used internally via `@discue/open-telemetry-tracing/instrumentation` to get ahold of the current tracer. Users of this library should not need to use this export.

## Test
```bash
./test.sh
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
