"use client"

import React from "react"

export default function ModalConfirm({
    visible,
    title = "Confirmation",
    message = "Etes-vous sur ?",
    confirmLabel = "Confirmer",
    cancelLabel = "Annuler",
    onCancel,
    onConfirm,
}) {
    if (!visible) {
        return null
    }

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onCancel}>
            <div className="modal-card" onClick={(event) => event.stopPropagation()}>
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button type="button" className="icon-button" onClick={onCancel} aria-label="Fermer">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-ghost" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
