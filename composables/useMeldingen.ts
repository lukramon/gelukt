const LS_SLEUTEL = 'gelukt-meldingen'

export type Frequentie = 'dagelijks' | 'werkdagen' | 'weekend'

export interface MeldingInstellingen {
  aktief: boolean
  tijdstip: string
  frequentie: Frequentie
}

function standaard(): MeldingInstellingen {
  return { aktief: false, tijdstip: '08:00', frequentie: 'dagelijks' }
}

export function useMeldingen() {
  const ondersteund = computed(() =>
    process.client && 'Notification' in window && 'serviceWorker' in navigator
  )

  const instellingen = ref<MeldingInstellingen>(standaard())
  const toestemming = ref<NotificationPermission>('default')

  function laden() {
    if (!process.client) return
    toestemming.value = Notification.permission
    try {
      const raw = localStorage.getItem(LS_SLEUTEL)
      if (raw) instellingen.value = { ...standaard(), ...JSON.parse(raw) }
    } catch {}
  }

  async function vraagToestemming(): Promise<boolean> {
    if (!process.client || !('Notification' in window)) return false
    const p = await Notification.requestPermission()
    toestemming.value = p
    return p === 'granted'
  }

  async function stuurNaarSW() {
    if (!process.client || !('serviceWorker' in navigator)) return
    try {
      const reg = await navigator.serviceWorker.ready
      reg.active?.postMessage({ type: 'PLAN_MELDING', ...instellingen.value })
    } catch {}
  }

  async function slaOp(nieuw: MeldingInstellingen) {
    instellingen.value = nieuw
    localStorage.setItem(LS_SLEUTEL, JSON.stringify(nieuw))
    await stuurNaarSW()
  }

  return { ondersteund, instellingen, toestemming, laden, vraagToestemming, slaOp, stuurNaarSW }
}
