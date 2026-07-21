import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const Icon = iconMap[type] || Info;

  return (
    <div className={`toast toast-${type}`} role="status" aria-live="polite">
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-white/80 transition-colors hover:text-white" aria-label="Dismiss">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
