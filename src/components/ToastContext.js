"use client"

import React, { createContext, useContext, useCallback, useMemo, useState } from "react"

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
    }, [])

    const showToast = useCallback(
        (message, type = "info", duration = 3500) => {
            const id = `${Date.now()}-${Math.random()}`
            setToasts((current) => [...current, { id, message, type }])

            window.setTimeout(() => {
                removeToast(id)
            }, duration)
        },
        [removeToast]
    )

    const contextValue = useMemo(
        () => ({
            showToast,
        }),
        [showToast]
    )

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className="toast-layer" aria-live="polite" aria-atomic="true">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type}`}>
                        <span className="toast-dot" aria-hidden="true"></span>
                        <p className="toast-message">{toast.message}</p>
                        <button
                            type="button"
                            className="icon-button"
                            onClick={() => removeToast(toast.id)}
                            aria-label="Fermer la notification"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast doit etre utilise dans un ToastProvider")
    }
    return context.showToast
}

export default ToastContext
