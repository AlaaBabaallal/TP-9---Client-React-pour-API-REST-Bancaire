"use client"

import { useState, useCallback } from "react"
import CompteList from "./components/CompteList"
import CompteForm from "./components/CompteForm"
import { ToastProvider } from "./components/ToastContext"
import "./App.css"

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [newAccount, setNewAccount] = useState(null)
    const [stats, setStats] = useState({
        totalAccounts: 0,
        totalBalance: 0,
        lastUpdate: null,
    })

    const handleAccountCreated = useCallback((account) => {
        setNewAccount(account)
        setRefreshTrigger((prev) => prev + 1)
    }, [])

    return (
        <ToastProvider>
            <div className="app-shell">
                <header className="app-hero">
                    <div className="hero-content">
                        <p className="hero-kicker">Gestion de comptes</p>
                        <h1>Simplifiez le suivi de vos comptes bancaires</h1>
                        <p className="hero-subtitle">
                            Creez, mettez a jour et suivez vos comptes en temps reel dans une interface
                            concue pour la productivite.
                        </p>
                        <div className="hero-actions">
                            <a href="#create-account" className="btn btn-primary">
                                Nouveau compte
                            </a>
                            <a href="#accounts" className="btn btn-ghost">
                                Voir la liste
                            </a>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="hero-card">
                            <div className="hero-card-header">
                                <i className="bi bi-piggy-bank"></i>
                                <span>Comptes actifs</span>
                            </div>
                            <div className="hero-card-value">{stats.totalAccounts}</div>
                            <p className="hero-card-meta">
                                Derniere mise a jour {formatDate(stats.lastUpdate)}
                            </p>
                        </div>
                        <div className="hero-card secondary">
                            <div className="hero-card-header">
                                <i className="bi bi-cash-stack"></i>
                                <span>Solde cumule</span>
                            </div>
                            <div className="hero-card-value">{formatCurrency(stats.totalBalance)}</div>
                            <p className="hero-card-meta">Montant total de tous les comptes</p>
                        </div>
                    </div>
                </header>

                <main className="app-main">
                    <section className="summary-grid">
                        <article className="summary-card">
                            <span className="summary-label">Comptes actifs</span>
                            <strong className="summary-value">{stats.totalAccounts}</strong>
                        </article>
                        <article className="summary-card">
                            <span className="summary-label">Solde cumule</span>
                            <strong className="summary-value">{formatCurrency(stats.totalBalance)}</strong>
                        </article>
                        <article className="summary-card">
                            <span className="summary-label">Derniere mise a jour</span>
                            <strong className="summary-value summary-date">
                                {formatDate(stats.lastUpdate)}
                            </strong>
                        </article>
                    </section>

                    <section className="panels-grid">
                        <article className="panel" id="create-account">
                            <header className="panel-header">
                                <div>
                                    <p className="panel-kicker">Nouveau compte</p>
                                    <h2>Declarer un compte</h2>
                                    <p className="panel-subtitle">
                                        Renseignez les informations de base pour ajouter un compte bancaire.
                                    </p>
                                </div>
                            </header>
                            <div className="panel-body">
                                <CompteForm onAccountCreated={handleAccountCreated} />
                            </div>
                        </article>

                        <article className="panel" id="accounts">
                            <header className="panel-header">
                                <div>
                                    <p className="panel-kicker">Vue detaillee</p>
                                    <h2>Comptes existants</h2>
                                    <p className="panel-subtitle">
                                        Filtrez, modifiez ou supprimez les comptes existants en toute simplicite.
                                    </p>
                                </div>
                            </header>
                            <div className="panel-body">
                                <CompteList
                                    refreshTrigger={refreshTrigger}
                                    newAccount={newAccount}
                                    onSummaryChange={setStats}
                                />
                            </div>
                        </article>
                    </section>
                </main>

                <footer className="app-footer">
                    <p>
                        &copy; {new Date().getFullYear()} BankHub. Gestion de comptes simplifiee.
                    </p>
                </footer>
            </div>
        </ToastProvider>
    )
}

function formatCurrency(value) {
    if (!Number.isFinite(value)) {
        return "0.00 MAD"
    }
    return `${value.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} MAD`
}

function formatDate(isoString) {
    if (!isoString) {
        return "En attente"
    }
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) {
        return "En attente"
    }
    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

export default App
