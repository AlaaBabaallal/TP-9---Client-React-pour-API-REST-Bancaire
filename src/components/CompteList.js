"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import API_BASE_URL from "../config"
import ModalConfirm from "./ModalConfirm"
import { useToast } from "./ToastContext"
import ModernDatePicker from "./ModernDatePicker"

export default function CompteList({ refreshTrigger, newAccount, onSummaryChange }) {
    const [comptes, setComptes] = useState([])
    const [filteredComptes, setFilteredComptes] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [editingCompte, setEditingCompte] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [confirmDeleteId, setConfirmDeleteId] = useState(null)
    const showToast = useToast()

    const fetchComptes = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${API_BASE_URL}/comptes`)
            const data = Array.isArray(response.data) ? response.data : [response.data]
            setComptes(data)
            setFilteredComptes(data)
        } catch (error) {
            console.error(error)
            showToast("Impossible de charger les comptes", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComptes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshTrigger])

    useEffect(() => {
        if (!newAccount) {
            return
        }
        setComptes((prev) => {
            const alreadyExists = prev.some((item) => item.id === newAccount.id)
            if (alreadyExists) {
                return prev.map((item) => (item.id === newAccount.id ? newAccount : item))
            }
            return [newAccount, ...prev]
        })
        setFilteredComptes((prev) => {
            const alreadyExists = prev.some((item) => item.id === newAccount.id)
            if (alreadyExists) {
                return prev.map((item) => (item.id === newAccount.id ? newAccount : item))
            }
            return [newAccount, ...prev]
        })
    }, [newAccount])

    useEffect(() => {
        if (!onSummaryChange) {
            return
        }
        const totalBalance = comptes.reduce((acc, compte) => acc + Number(compte.solde || 0), 0)
        onSummaryChange({
            totalAccounts: comptes.length,
            totalBalance,
            lastUpdate: new Date().toISOString(),
        })
    }, [comptes, onSummaryChange])

    const handleSearchChange = (event) => {
        const value = event.target.value
        setSearchValue(value)

        if (!value.trim()) {
            setFilteredComptes(comptes)
            return
        }

        const normalisedValue = value.toLowerCase()
        const filtered = comptes.filter((compte) => {
            const id = compte.id?.toString().toLowerCase() || ""
            const type = compte.type?.toLowerCase() || ""
            return id.includes(normalisedValue) || type.includes(normalisedValue)
        })
        setFilteredComptes(filtered)
    }

    const resetSearch = () => {
        setSearchValue("")
        setFilteredComptes(comptes)
    }

    const openEditModal = (compte) => {
        setEditingCompte(compte)
        setShowEditModal(true)
    }

    const closeEditModal = () => {
        setEditingCompte(null)
        setShowEditModal(false)
    }

    const requestDelete = (id) => {
        setConfirmDeleteId(id)
    }

    const performDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/comptes/${id}`)
            setComptes((prev) => prev.filter((compte) => compte.id !== id))
            setFilteredComptes((prev) => prev.filter((compte) => compte.id !== id))
            showToast("Compte supprime", "success")
        } catch (error) {
            console.error(error)
            showToast("Erreur lors de la suppression", "error")
        } finally {
            setConfirmDeleteId(null)
        }
    }

    return (
        <div className="accounts-module">
            <div className="module-toolbar">
                <div className="search-field">
                    <i className="bi bi-search"></i>
                    <input
                        type="text"
                        placeholder="Rechercher un identifiant ou un type"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                    {searchValue && (
                        <button type="button" className="icon-button" onClick={resetSearch} aria-label="Effacer la recherche">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    )}
                </div>
                <div className="toolbar-meta">
                    <span className="meta-pill">
                        <i className="bi bi-collection"></i>
                        {filteredComptes.length} comptes
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="module-placeholder">
                    <div className="loading-spinner" aria-hidden="true"></div>
                    <p>Chargement des comptes...</p>
                </div>
            ) : filteredComptes.length === 0 ? (
                <div className="module-placeholder empty">
                    <i className="bi bi-inboxes"></i>
                    <p>Aucun compte ne correspond a votre recherche.</p>
                </div>
            ) : (
                <div className="table-card">
                    <table className="accounts-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Solde</th>
                                <th>Date</th>
                                <th>Type</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredComptes.map((compte) => (
                                <tr key={compte.id}>
                                    <td>
                                        <span className="id-chip">{compte.id}</span>
                                    </td>
                                    <td>
                                        <span className="amount-chip">
                                            {Number(compte.solde || 0).toLocaleString("fr-FR", {
                                                style: "currency",
                                                currency: "MAD",
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="date-chip">{compte.dateCreation}</span>
                                    </td>
                                    <td>
                                        <span className={`type-chip type-${(compte.type || "").toLowerCase()}`}>
                                            {compte.type || "Non defini"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="row-actions">
                                            <button type="button" className="icon-button" onClick={() => openEditModal(compte)} aria-label="Modifier le compte">
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button type="button" className="icon-button danger" onClick={() => requestDelete(compte.id)} aria-label="Supprimer le compte">
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showEditModal && editingCompte && (
                <div className="modal-overlay" role="dialog" aria-modal="true" onClick={closeEditModal}>
                    <div className="modal-card large" onClick={(event) => event.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Modifier le compte</h3>
                            <button type="button" className="icon-button" onClick={closeEditModal} aria-label="Fermer">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <EditForm
                                compte={editingCompte}
                                onSuccess={() => {
                                    closeEditModal()
                                    fetchComptes()
                                    showToast("Compte mis a jour", "success")
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <ModalConfirm
                visible={Boolean(confirmDeleteId)}
                title="Supprimer le compte"
                message="Voulez-vous vraiment supprimer ce compte ?"
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onCancel={() => setConfirmDeleteId(null)}
                onConfirm={() => performDelete(confirmDeleteId)}
            />
        </div>
    )
}

function EditForm({ compte, onSuccess }) {
    const [formData, setFormData] = useState({
        solde: compte.solde?.toString() || "",
        dateCreation: compte.dateCreation || "",
        type: compte.type || "",
    })
    const [loading, setLoading] = useState(false)
    const showToast = useToast()

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setLoading(true)
        try {
            await axios.put(`${API_BASE_URL}/comptes/${compte.id}`, formData)
            onSuccess()
        } catch (error) {
            console.error(error)
            showToast("Impossible de mettre a jour le compte", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="account-form" noValidate>
            <div className="field">
                <label htmlFor="edit-solde" className="field-label">
                    <i className="bi bi-cash-coin"></i>
                    <span>Solde (MAD)</span>
                </label>
                <div className="field-control">
                    <span className="field-prefix">MAD</span>
                    <input
                        id="edit-solde"
                        name="solde"
                        type="number"
                        step="0.01"
                        min="0"
                        className="field-input"
                        value={formData.solde}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="field">
                <label htmlFor="edit-dateCreation" className="field-label">
                    <i className="bi bi-calendar-event"></i>
                    <span>Date de creation</span>
                </label>
                <ModernDatePicker
                    value={formData.dateCreation}
                    onChange={handleChange}
                    name="dateCreation"
                    placeholder="Choisir une date"
                    className="field-date"
                />
            </div>

            <div className="field">
                <label htmlFor="edit-type" className="field-label">
                    <i className="bi bi-card-list"></i>
                    <span>Type de compte</span>
                </label>
                <select
                    id="edit-type"
                    name="type"
                    className="field-input select"
                    value={formData.type}
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
                        <span>Enregistrement...</span>
                    </>
                ) : (
                    <>
                        <i className="bi bi-check-circle"></i>
                        <span>Mettre a jour</span>
                    </>
                )}
            </button>
        </form>
    )
}
