"use client"

import { useState } from "react"
import axios from "axios"
import API_BASE_URL from "../config"
import { useToast } from "./ToastContext"
import ModernDatePicker from "./ModernDatePicker"

function CompteForm({ onAccountCreated }) {
    const [compte, setCompte] = useState({ solde: "", dateCreation: "", type: "" })
    const [loading, setLoading] = useState(false)
    const showToast = useToast()

    const handleChange = (e) => {
        const { name, value } = e.target
        setCompte((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${API_BASE_URL}/comptes`, compte)
            showToast("Compte cree avec succes", "success")
            setCompte({ solde: "", dateCreation: "", type: "" })
            if (onAccountCreated) {
                onAccountCreated(response.data)
            }
        } catch (error) {
            console.error(error)
            showToast("Erreur lors de la creation du compte", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="account-form" noValidate>
            <div className="field">
                <label htmlFor="solde" className="field-label">
                    <i className="bi bi-cash-coin"></i>
                    <span>Solde (MAD)</span>
                </label>
                <div className="field-control">
                    <span className="field-prefix">MAD</span>
                    <input
                        id="solde"
                        name="solde"
                        type="number"
                        step="0.01"
                        min="0"
                        className="field-input"
                        placeholder="0.00"
                        value={compte.solde}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="field">
                <label htmlFor="dateCreation" className="field-label">
                    <i className="bi bi-calendar-event"></i>
                    <span>Date de creation</span>
                </label>
                <ModernDatePicker
                    value={compte.dateCreation}
                    onChange={handleChange}
                    name="dateCreation"
                    placeholder="Choisir une date"
                    className="field-date"
                />
            </div>

            <div className="field">
                <label htmlFor="type" className="field-label">
                    <i className="bi bi-card-list"></i>
                    <span>Type de compte</span>
                </label>
                <select
                    id="type"
                    name="type"
                    className="field-input select"
                    value={compte.type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selectionner un type</option>
                    <option value="COURANT">Compte courant</option>
                    <option value="EPARGNE">Compte epargne</option>
                </select>
            </div>

            <button type="submit" className="btn btn-primary form-submit" disabled={loading}>
                {loading ? (
                    <>
                        <i className="bi bi-hourglass-split"></i>
                        <span>Creation en cours...</span>
                    </>
                ) : (
                    <>
                        <i className="bi bi-check-circle"></i>
                        <span>Creer un compte</span>
                    </>
                )}
            </button>
        </form>
    )
}

export default CompteForm
