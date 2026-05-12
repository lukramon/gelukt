import type { TriggerCategorie } from '~/types/recovery'

export function useTriggers() {
  const { appData, slaAllesOp } = useStorage()

  const gesorteerd = computed(() =>
    [...appData.value.triggers].sort((a, b) => b.aantalKeer - a.aantalKeer)
  )

  async function voegToe(naam: string) {
    appData.value.triggers.push({ id: Date.now().toString(), naam: naam.trim(), aantalKeer: 0 })
    await slaAllesOp()
  }

  async function verwijder(id: string) {
    appData.value.triggers = appData.value.triggers.filter(t => t.id !== id)
    await slaAllesOp()
  }

  async function verhoogTeller(id: string) {
    const t = appData.value.triggers.find(t => t.id === id)
    if (t) { t.aantalKeer++; await slaAllesOp() }
  }

  return { triggers: computed(() => appData.value.triggers), gesorteerd, voegToe, verwijder, verhoogTeller }
}
