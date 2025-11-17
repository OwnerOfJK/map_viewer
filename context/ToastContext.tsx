import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '../components/Toast';
import { ToastType } from '../utils/types';
import { TOAST_DURATION } from '../utils/constants';

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
    duration: TOAST_DURATION,
  });

  const showToast = (message: string, type: ToastType = 'info', duration: number = TOAST_DURATION) => {
    setToast({
      visible: true,
      message,
      type,
      duration,
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onDismiss={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
