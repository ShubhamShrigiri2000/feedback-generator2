const listeners = new Set();

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const emit = (toast) => { listeners.forEach((cb) => cb(toast)); };

const genId = () => `${Date.now().toString(36)}-${Math.floor(Math.random()*10000).toString(36)}`;

export const show = (message, type = 'info', opts = {}) => {
  const toast = { id: genId(), type, message, duration: opts.duration ?? 4000, createdAt: Date.now() };
  emit({ action: 'add', toast });
  return toast.id;
};

export const dismiss = (id) => emit({ action: 'remove', id });

export const showSuccess = (message, opts) => show(message, 'success', opts);
export const showError = (message, opts) => show(message, 'error', opts);
export const showWarning = (message, opts) => show(message, 'warning', opts);
export const showInfo = (message, opts) => show(message, 'info', opts);

export default { subscribe, show, dismiss, showSuccess, showError, showWarning, showInfo };
