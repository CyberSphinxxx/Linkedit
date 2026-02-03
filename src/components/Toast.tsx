'use client';

import { useEffect, useState } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

let toastHandler: ToastContextType['showToast'] | null = null;

export function useToast() {
    return {
        showToast: (message: string, type: 'success' | 'error' | 'info' = 'success') => {
            if (toastHandler) {
                toastHandler(message, type);
            }
        },
    };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        toastHandler = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
            const id = Date.now().toString();
            setToasts((prev) => [...prev, { id, message, type }]);

            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 3000);
        };

        return () => {
            toastHandler = null;
        };
    }, []);

    return (
        <>
            {children}

            {/* Toast container */}
            <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              px-4 py-3 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-3
              animate-slide-up
              ${toast.type === 'success' ? 'bg-success/20 border border-success/30 text-success' : ''}
              ${toast.type === 'error' ? 'bg-error/20 border border-error/30 text-error' : ''}
              ${toast.type === 'info' ? 'bg-primary/20 border border-primary/30 text-primary' : ''}
            `}
                    >
                        {toast.type === 'success' && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {toast.type === 'error' && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        {toast.type === 'info' && (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
