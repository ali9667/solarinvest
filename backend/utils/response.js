export const success = (res, data = {}, statusCode = 200, meta = {}) =>
  res.status(statusCode).json({
    success: true,
    data,
    meta: { requestId: res.locals.requestId || null, timestamp: new Date().toISOString(), ...meta },
  });

export const successPaginated = (res, data, pagination, meta = {}) =>
  res.status(200).json({
    success: true,
    data,
    meta: { requestId: res.locals.requestId || null, timestamp: new Date().toISOString(), pagination, ...meta },
  });

export const failure = (res, code, message, statusCode = 500, details = []) =>
  res.status(statusCode).json({
    success: false,
    error: { code, message, details },
    meta: { requestId: res.locals.requestId || null, timestamp: new Date().toISOString() },
  });
