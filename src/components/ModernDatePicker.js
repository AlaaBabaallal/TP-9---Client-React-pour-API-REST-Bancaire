"use client"

import React, { useState, useRef, useEffect } from "react"

export default function ModernDatePicker({
    value,
    onChange,
    name,
    placeholder = "Selectionner une date",
    className = "",
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState(value || "")
    const [displayMonth, setDisplayMonth] = useState(new Date())
    const pickerRef = useRef(null)

    const months = [
        "Janvier",
        "Fevrier",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Aout",
        "Septembre",
        "Octobre",
        "Novembre",
        "Decembre",
    ]

    const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

    useEffect(() => {
        if (!value) {
            return
        }
        setSelectedDate(value)
        const parsed = new Date(value)
        if (!Number.isNaN(parsed.getTime())) {
            setDisplayMonth(parsed)
        }
    }, [value])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) {
            return ""
        }
        const date = new Date(`${dateStr}T00:00:00`)
        if (Number.isNaN(date.getTime())) {
            return ""
        }
        return date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
    }

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days = []

        for (let i = 0; i < startingDayOfWeek; i += 1) {
            days.push(null)
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            days.push(day)
        }

        return days
    }

    const handleDateClick = (day) => {
        if (!day) {
            return
        }
        const nextDate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day)
        const isoDate = nextDate.toISOString().split("T")[0]

        setSelectedDate(isoDate)
        onChange({ target: { name, value: isoDate } })
        setIsOpen(false)
    }

    const moveMonth = (delta) => {
        const next = new Date(displayMonth)
        next.setMonth(next.getMonth() + delta)
        setDisplayMonth(next)
    }

    const moveYear = (delta) => {
        const next = new Date(displayMonth)
        next.setFullYear(next.getFullYear() + delta)
        setDisplayMonth(next)
    }

    const isToday = (day) => {
        if (!day) {
            return false
        }
        const today = new Date()
        const candidate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day)
        return candidate.toDateString() === today.toDateString()
    }

    const isSelected = (day) => {
        if (!selectedDate || !day) {
            return false
        }
        const candidate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day)
        const selected = new Date(`${selectedDate}T00:00:00`)
        return candidate.toDateString() === selected.toDateString()
    }

    return (
        <div className={`modern-date-picker ${className}`} ref={pickerRef}>
            <button
                type="button"
                className="date-input-wrapper"
                onClick={() => setIsOpen((open) => !open)}
            >
                <i className="bi bi-calendar3" aria-hidden="true"></i>
                <span className={`date-display-input ${selectedDate ? "filled" : ""}`}>
                    {formatDisplayDate(selectedDate) || placeholder}
                </span>
                <i className={`bi bi-chevron-${isOpen ? "up" : "down"} chevron-icon`} aria-hidden="true"></i>
            </button>

            {isOpen && (
                <div className="date-picker-dropdown">
                    <div className="picker-header">
                        <div className="month-year-controls">
                            <button type="button" onClick={() => moveYear(-1)} className="nav-btn" aria-label="Annee precedente">
                                <i className="bi bi-chevron-double-left"></i>
                            </button>
                            <button type="button" onClick={() => moveMonth(-1)} className="nav-btn" aria-label="Mois precedent">
                                <i className="bi bi-chevron-left"></i>
                            </button>

                            <div className="month-year-display">
                                <span className="month-name">{months[displayMonth.getMonth()]}</span>
                                <span className="year-name">{displayMonth.getFullYear()}</span>
                            </div>

                            <button type="button" onClick={() => moveMonth(1)} className="nav-btn" aria-label="Mois suivant">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                            <button type="button" onClick={() => moveYear(1)} className="nav-btn" aria-label="Annee suivante">
                                <i className="bi bi-chevron-double-right"></i>
                            </button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        <div className="weekday-header">
                            {weekDays.map((day) => (
                                <div key={day} className="weekday-cell">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="days-grid">
                            {getDaysInMonth(displayMonth).map((day, index) => (
                                <button
                                    key={`${day || "empty"}-${index}`}
                                    type="button"
                                    className={[
                                        "day-cell",
                                        !day ? "empty" : "",
                                        isToday(day) ? "today" : "",
                                        isSelected(day) ? "selected" : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    onClick={() => handleDateClick(day)}
                                    disabled={!day}
                                >
                                    {day || ""}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="picker-footer">
                        <button
                            type="button"
                            className="today-btn"
                            onClick={() => {
                                const today = new Date().toISOString().split("T")[0]
                                setSelectedDate(today)
                                onChange({ target: { name, value: today } })
                                setIsOpen(false)
                            }}
                        >
                            Aujourd hui
                        </button>
                        <button
                            type="button"
                            className="clear-btn"
                            onClick={() => {
                                setSelectedDate("")
                                onChange({ target: { name, value: "" } })
                                setIsOpen(false)
                            }}
                        >
                            Effacer
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
