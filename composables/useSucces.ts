import type { SuccesvolDag } from '~/types/recovery'

export function useSucces() {
  const { appData, slaAllesOp } = useStorage()

  async function logSucces(datumTijd: string, notitie?: string) {
    appData.value.succesvolleDagen.push({
      id: Date.now().toString(),
      datumTijd,
      notitie,
    })
    await slaAllesOp()
  }

  const succesvolleDagen = computed(() => appData.value.succesvolleDagen ?? [])

  return { succesvolleDagen, logSucces }
}
