// src/services/media.js — Utilità condivise per la gestione di URL immagini

/** Immagine di fallback per le attività (foto stock di corsa) */
export const FALLBACK_ATTIVITA = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80'

/**
 * Converte un link di condivisione Google Drive in un URL direttamente visualizzabile.
 * Supporta i formati: /file/d/ID/, ?id=ID, open?id=ID
 */
export function convertiUrlDrive(url) {
  if (!url) return null
  try {
    const matchFile = url.match(/\/file\/d\/([^/?#]+)/)
    if (matchFile) return `https://drive.google.com/thumbnail?id=${matchFile[1]}&sz=w600`
    const matchId = url.match(/[?&]id=([^&]+)/)
    if (matchId) return `https://drive.google.com/thumbnail?id=${matchId[1]}&sz=w600`
  } catch (e) {
    console.error('Errore conversione URL Drive:', e)
  }
  return url
}

/** Genera un avatar con iniziali tramite ui-avatars */
export function urlFallbackAvatar(nome) {
  return `https://ui-avatars.com/api/?background=E8520A&color=fff&size=150&bold=true&name=${encodeURIComponent(nome || '?')}`
}

/** Restituisce la foto profilo dell'utente con fallback automatico */
export function urlFoto(utente) {
  if (!utente) return urlFallbackAvatar('?')
  if (utente._avatarRotto) return urlFallbackAvatar(utente.displayName)
  return convertiUrlDrive(utente.photo) || urlFallbackAvatar(utente.displayName)
}

/**
 * Restituisce l'immagine dell'ultima attività.
 * Se non è impostata o è vuota → fallback Unsplash (MAI la foto profilo).
 */
export function urlAttivita(utente) {
  // Controlla esplicitamente che lastActivity sia una stringa non vuota
  const attivita = utente?.lastActivity?.trim()
  if (!attivita) return FALLBACK_ATTIVITA
  return convertiUrlDrive(attivita) || FALLBACK_ATTIVITA
}

/**
 * Genera una serie di URL Pravatar diversi per la selezione dell'avatar.
 * Usa indici da 1 a 70 (range completo di Pravatar).
 */
export function generaUrlAvatar(indice) {
  return `https://i.pravatar.cc/150?img=${indice}`
}

/** Genera un indice casuale per Pravatar tra 1 e 70 */
export function indiceCasuale() {
  return Math.floor(Math.random() * 70) + 1
}
