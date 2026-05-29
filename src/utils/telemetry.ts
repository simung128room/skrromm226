export const TelemetryContext = {
  sessionId: crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2),
  releaseVersion: "2.0.0-beta.45",
  featureFlags: {
    useDurableQueue: true,
    usePatchMutations: true,
    circuitBreakerEnabled: true,
  },
};

// Simple global trace context for sequential single-thread client environments
let currentTraceId: string | undefined;
let currentSpanId: string | undefined;

export const startTrace = (name: string, overrideParentSpan?: string) => {
  const traceId =
    currentTraceId ||
    (crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2));
  const parentSpanId = overrideParentSpan || currentSpanId;
  const spanId = crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);

  currentTraceId = traceId;
  currentSpanId = spanId;

  captureTelemetry(`SPAN_START:${name}`, {
    traceId,
    spanId,
    parentSpanId,
  });

  return {
    traceId,
    spanId,
    parentSpanId,
    end: (status: "SUCCESS" | "ERROR" = "SUCCESS", meta?: any) => {
      captureTelemetry(`SPAN_END:${name}`, {
        traceId,
        spanId,
        parentSpanId,
        status,
        ...meta,
      });
      // Pop context (simplified for demonstration)
      currentTraceId = undefined;
      currentSpanId = undefined;
    },
  };
};

export const captureTelemetry = (event: string, payload: any = {}) => {
  console.debug(`[Telemetry: ${event}]`, {
    ...TelemetryContext,
    traceId: payload.traceId || currentTraceId,
    spanId: payload.spanId || currentSpanId,
    parentSpanId: payload.parentSpanId || undefined,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ...payload,
  });
};
