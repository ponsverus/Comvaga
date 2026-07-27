export function withTimeout(request, ms, label = 'timeout') {
  const controller = typeof AbortController !== 'undefined' && typeof request?.abortSignal === 'function'
    ? new AbortController()
    : null;
  const promise = controller ? request.abortSignal(controller.signal) : request;
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      if (controller) controller.abort();
      reject(new Error(`Timeout (${label}) em ${ms}ms`));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}
