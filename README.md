
<p align="center">
<a href="https://www.discue.io/" target="_blank" rel="noopener noreferrer"><img width="128" src="https://www.discue.io/icons-fire-no-badge-square/web/icon-192.png" alt="Vue logo">
</a>
</p>

<br/>
<div align="center">

[![GitHub tag](https://img.shields.io/github/tag/discue/open-telementry-tracing?include_prereleases=&sort=semver&color=blue)](https://github.com/discue/open-telementry-tracing/releases/)
[![Latest Stable Version](https://img.shields.io/npm/v/@discue/open-telementry-tracing.svg)](https://www.npmjs.com/package/@discue/open-telementry-tracing)
[![License](https://img.shields.io/npm/l/@discue/open-telementry-tracing.svg)](https://www.npmjs.com/package/@discue/open-telementry-tracing)
<br/>
[![NPM Downloads](https://img.shields.io/npm/dt/@discue/open-telementry-tracing.svg)](https://www.npmjs.com/package/@discue/open-telementry-tracing)
[![NPM Downloads](https://img.shields.io/npm/dm/@discue/open-telementry-tracing.svg)](https://www.npmjs.com/package/@discue/open-telementry-tracing)
<br/>
[![contributions - welcome](https://img.shields.io/badge/contributions-welcome-blue)](/CONTRIBUTING.md "Go to contributions doc")
[![Made with Node.js](https://img.shields.io/badge/Node.js->=18-blue?logo=node.js&logoColor=white)](https://nodejs.org "Go to Node.js homepage")

</div>

# OpenTelemetry Tracing
Kickstarts your [OpenTelemetry](https://opentelemetry.io/docs/instrumentation/js/getting-started/nodejs/) implementation with first-class abstractions for
- adding tracing capabilities to NodeJS environments
- collecting and publishing of spans to local and cloud environments
- creating spans and child spans
- tracking successful completion of spans
- recording exceptions in case of errors during span execution

![Screenshot of traces collected by Jaeger.](traces.png)

## Usage
To enable tracing at runtime set the `NODE_OPTIONS` environment variable and `require` the file `./tracing/tracing.cjs`, which is the entry point for tracing.
- `NODE_OPTIONS=--require ./tracing/tracing.cjs`

## Configuration
The following environment variables will be used:
- `DSQ_OT_TRACING_SERVICE_NAME` 
  - default: api-kit
- `DSQ_OT_LOCAL_OLTP_URL`
  - default: http://127.0.0.1:4318/v1/traces
- `DSQ_OT_USE_SIMPLE_SPAN_PROCESSOR`
  - default: false

## Test
```bash
./test.sh
```

## License

[MIT](https://choosealicense.com/licenses/mit/)