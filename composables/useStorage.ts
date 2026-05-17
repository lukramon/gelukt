import type { AppData } from '~/types/recovery'

const LS_SLEUTEL = 'gelukt-appdata'

const HUIDIGE_VERSIE = '1.3'

function standaardData(): AppData {
  const nu = new Date().toISOString()
  return {
    versie: HUIDIGE_VERSIE,
    streak: { eersteBeginDatum: nu, beginDatum: nu, terugvallen: [] },
    triggers: [],
    drang: [],
    plan: { redenen: [] },
    opgeslagenBronnen: [],
    succesvolleDagen: [],
  }
}

// Zorgt dat opgeslagen data altijd alle velden heeft, ook na app-updates.
// Geeft ook terug of er een migratie nodig was, zodat we het bestand kunnen herschrijven.
function migreer(raw: Record<string, unknown>): { data: AppData; gemigreerd: boolean } {
  const basis = standaardData()
  const gemigreerd = raw.versie !== HUIDIGE_VERSIE

  // Bereken de correcte beginDatum: altijd de datum van de meest recente terugval.
  // Dit repareert ook de bug waarbij beginDatum op 'nu' werd gezet i.p.v. de terugvaldatum.
  const streakRaw = (raw.streak ?? {}) as Record<string, unknown>
  const terugvallenRaw = Array.isArray(streakRaw.terugvallen)
    ? (streakRaw.terugvallen as Array<{ datumTijd: string }>)
    : []
  const meesteRecente = [...terugvallenRaw].sort(
    (a, b) => new Date(b.datumTijd).getTime() - new Date(a.datumTijd).getTime()
  )[0]
  const correcteBeginDatum = meesteRecente?.datumTijd
    ?? (streakRaw.eersteBeginDatum as string | undefined)
    ?? basis.streak.beginDatum

  return {
    gemigreerd,
    data: {
      ...basis,
      ...(raw as Partial<AppData>),
      versie: HUIDIGE_VERSIE,
      streak: {
        ...basis.streak,
        ...((raw.streak ?? {}) as object),
        beginDatum: correcteBeginDatum,
      },
      plan:   { ...basis.plan, ...((raw.plan ?? {}) as object) },
      triggers:          Array.isArray(raw.triggers)          ? raw.triggers          : basis.triggers,
      drang:             Array.isArray(raw.drang)             ? raw.drang             : basis.drang,
      opgeslagenBronnen: Array.isArray(raw.opgeslagenBronnen) ? raw.opgeslagenBronnen : basis.opgeslagenBronnen,
      succesvolleDagen:  Array.isArray(raw.succesvolleDagen)  ? raw.succesvolleDagen  : basis.succesvolleDagen,
    },
  }
}

// FileSystemFileHandle is niet JSON-serialiseerbaar — we gebruiken IndexedDB.
function openHandleDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('gelukt-handles', 1)
    req.onupgradeneeded = () => req.result.createObjectStore('handles')
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function slaHandleOp(handle: FileSystemFileHandle): Promise<void> {
  const db = await openHandleDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('handles', 'readwrite')
    tx.objectStore('handles').put(handle, 'data-bestand')
    tx.oncomplete = () => { db.close(); resolve() }
    tx.onerror = () => { db.close(); reject(tx.error) }
  })
}

async function laadHandleUitDB(): Promise<FileSystemFileHandle | null> {
  try {
    const db = await openHandleDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('handles', 'readonly')
      const req = tx.objectStore('handles').get('data-bestand')
      req.onsuccess = () => { db.close(); resolve(req.result ?? null) }
      req.onerror = () => { db.close(); reject(req.error) }
    })
  } catch {
    return null
  }
}

export function useStorage() {
  const ondersteund = process.client && 'showSaveFilePicker' in window

  const appData = useState<AppData>('appData', standaardData)
  const bestandGekoppeld = useState<boolean>('bestandGekoppeld', () => false)
  const bestandNaam = useState<string>('bestandNaam', () => '')
  const toestemmingNodig = useState<boolean>('toestemmingNodig', () => false)

  // --- Fallback: localStorage ---

  function laadVanLocalStorage() {
    if (!process.client) return
    try {
      const raw = localStorage.getItem(LS_SLEUTEL)
      if (raw) appData.value = migreer(JSON.parse(raw)).data
    } catch {}
  }

  function schrijfNaarLocalStorage() {
    if (!process.client) return
    localStorage.setItem(LS_SLEUTEL, JSON.stringify(appData.value))
  }

  // --- File System Access API ---
  // Elke slaAllesOp()-aanroep schrijft naar dit bestand.
  // Staat het bestand in iCloud Drive of Dropbox? Dan regelt die dienst de sync.

  async function schrijfNaarBestand(): Promise<void> {
    const handle = await laadHandleUitDB()
    if (!handle) { schrijfNaarLocalStorage(); return }
    try {
      const w = await handle.createWritable()
      await w.write(JSON.stringify(appData.value, null, 2))
      await w.close()
    } catch {
      schrijfNaarLocalStorage()
    }
  }

  async function laadVanBestand(): Promise<'geladen' | 'toestemming-nodig' | 'geen-bestand'> {
    const handle = await laadHandleUitDB()
    if (!handle) return 'geen-bestand'

    const permissie = await handle.queryPermission({ mode: 'readwrite' })
    if (permissie !== 'granted') return 'toestemming-nodig'

    try {
      const bestand = await handle.getFile()
      const tekst = await bestand.text()
      if (tekst.trim()) {
        const { data, gemigreerd } = migreer(JSON.parse(tekst))
        appData.value = data
        if (gemigreerd) {
          // Nieuwe velden schrijven we meteen terug naar het bestand
          const w = await handle.createWritable()
          await w.write(JSON.stringify(data, null, 2))
          await w.close()
        }
      }
      bestandGekoppeld.value = true
      bestandNaam.value = handle.name
      toestemmingNodig.value = false
      return 'geladen'
    } catch {
      return 'geen-bestand'
    }
  }

  async function vraagToestemming(): Promise<boolean> {
    const handle = await laadHandleUitDB()
    if (!handle) return false
    try {
      const status = await handle.requestPermission({ mode: 'readwrite' })
      if (status !== 'granted') return false
      const bestand = await handle.getFile()
      const tekst = await bestand.text()
      if (tekst.trim()) {
        const { data, gemigreerd } = migreer(JSON.parse(tekst))
        appData.value = data
        if (gemigreerd) {
          // Nieuwe velden schrijven we meteen terug naar het bestand
          const w = await handle.createWritable()
          await w.write(JSON.stringify(data, null, 2))
          await w.close()
        }
      }
      bestandGekoppeld.value = true
      bestandNaam.value = handle.name
      toestemmingNodig.value = false
      return true
    } catch {
      return false
    }
  }

  async function kiesBestaandBestand(): Promise<boolean> {
    if (!ondersteund) return false
    try {
      const handles = await window.showOpenFilePicker({
        id: 'gelukt-data',
        excludeAcceptAllOption: false,
        types: [{ description: 'Gelukt data', accept: { 'application/json': ['.json'] } }],
      })
      const handle = handles[0]
      await slaHandleOp(handle)
      const bestand = await handle.getFile()
      const tekst = await bestand.text()
      if (tekst.trim()) {
        appData.value = { ...standaardData(), ...JSON.parse(tekst) }
      } else {
        await schrijfNaarBestand()
      }
      bestandGekoppeld.value = true
      bestandNaam.value = handle.name
      return true
    } catch (e: unknown) {
      if ((e as Error).name === 'AbortError') return false
      throw e
    }
  }

  async function maakNieuwBestand(): Promise<boolean> {
    if (!ondersteund) return false
    try {
      const handle = await window.showSaveFilePicker({
        id: 'gelukt-data',
        suggestedName: 'gelukt-data.json',
        types: [{ description: 'Gelukt data', accept: { 'application/json': ['.json'] } }],
      })
      await slaHandleOp(handle)
      const localRaw = localStorage.getItem(LS_SLEUTEL)
      if (localRaw) {
        try { appData.value = { ...standaardData(), ...JSON.parse(localRaw) } } catch {}
      }
      const w = await handle.createWritable()
      await w.write(JSON.stringify(appData.value, null, 2))
      await w.close()
      bestandGekoppeld.value = true
      bestandNaam.value = handle.name
      return true
    } catch (e: unknown) {
      if ((e as Error).name === 'AbortError') return false
      throw e
    }
  }

  async function initialiseer(): Promise<void> {
    if (!process.client) return
    if (!ondersteund) {
      laadVanLocalStorage()
      return
    }
    const status = await laadVanBestand()
    if (status === 'toestemming-nodig') {
      toestemmingNodig.value = true
      laadVanLocalStorage()
    } else if (status === 'geen-bestand') {
      laadVanLocalStorage()
    }
  }

  async function slaAllesOp(): Promise<void> {
    // Als toestemming nodig is, vraag die nu — de gebruiker heeft net een actie gedaan
    // (user gesture), dus de browser staat het toe.
    if (toestemmingNodig.value) {
      await vraagToestemming()
    }

    if (bestandGekoppeld.value) {
      await schrijfNaarBestand()
    } else {
      schrijfNaarLocalStorage()
    }
  }

  async function verwijderAlles(): Promise<void> {
    appData.value = standaardData()
    if (bestandGekoppeld.value) {
      await schrijfNaarBestand()
    } else {
      schrijfNaarLocalStorage()
    }
  }

  // Herlaad het bestand van schijf — nuttig als het op een ander toestel gewijzigd werd.
  async function verversVanBestand(): Promise<boolean> {
    return (await laadVanBestand()) === 'geladen'
  }

  // Importeer data vanuit een gekozen bestand (werkt in alle browsers als fallback).
  function importeerData(bestand: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const lezer = new FileReader()
      lezer.onload = async (e) => {
        try {
          const raw = JSON.parse(e.target?.result as string)
          appData.value = migreer(raw).data
          if (bestandGekoppeld.value) {
            await schrijfNaarBestand()
          } else {
            schrijfNaarLocalStorage()
          }
          resolve()
        } catch {
          reject(new Error('Ongeldig bestandsformaat'))
        }
      }
      lezer.onerror = () => reject(new Error('Kon het bestand niet lezen'))
      lezer.readAsText(bestand)
    })
  }

  function exporteerData(): void {
    if (!process.client) return
    const blob = new Blob([JSON.stringify(appData.value, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gelukt-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    appData,
    bestandGekoppeld,
    bestandNaam,
    toestemmingNodig,
    ondersteund,
    initialiseer,
    kiesBestaandBestand,
    maakNieuwBestand,
    vraagToestemming,
    slaAllesOp,
    exporteerData,
    importeerData,
    verwijderAlles,
    verversVanBestand,
  }
}
