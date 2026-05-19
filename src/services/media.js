// src/services/media.js — Utilità condivise per la gestione di URL immagini

/**
 * Converte un link di condivisione Google Drive in un URL direttamente visualizzabile.
 * Supporta i formati: /file/d/ID/, ?id=ID, open?id=ID
 */
export function convertiUrlDrive(url) {
  if (!url) return null
  const matchFile = url.match(/\/file\/d\/([^/?#]+)/)
  if (matchFile) return `https://drive.google.com/thumbnail?id=${matchFile[1]}&sz=w600`
  const matchId = url.match(/[?&]id=([^&]+)/)
  if (matchId) return `https://drive.google.com/thumbnail?id=${matchId[1]}&sz=w600`
  return url
}

/** Genera un avatar con iniziali tramite ui-avatars (nessuna dipendenza esterna) */
export function urlFallbackAvatar(nome) {
  return `https://ui-avatars.com/api/?background=E8520A&color=fff&size=150&bold=true&name=${encodeURIComponent(nome || '?')}`
}

/** Restituisce la foto profilo dell'utente con fallback automatico */
export function urlFoto(utente) {
  if (!utente) return urlFallbackAvatar('?')
  if (utente._avatarRotto) return urlFallbackAvatar(utente.displayName)
  return convertiUrlDrive(utente.photo) || urlFallbackAvatar(utente.displayName)
}

/** Restituisce l'immagine dell'ultima attività con fallback a foto stock */
export function urlAttivita(utente) {
  const fallback = 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80'
  if (!utente?.lastActivity) return fallback
  return convertiUrlDrive(utente.lastActivity) || fallback
}
