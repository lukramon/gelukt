export function useUrges() {
  const { appData, slaAllesOp } = useStorage()

  async function logDrang(intensiteit: number, triggerId?: string, triggerNaam?: string) {
    appData.value.drang.push({
      id: Date.now().toString(),
      datumTijd: new Date().toISOString(),
      intensiteit,
      triggerId,
      triggerNaam,
    })
    await slaAllesOp()
  }

  // Tellers per weekdag: index 0 = zondag, 1 = maandag, ...
  const perWeekdag = computed(() => {
    const tellers = [0, 0, 0, 0, 0, 0, 0]
    appData.value.drang.forEach(d => tellers[new Date(d.datumTijd).getDay()]++)
    return tellers
  })

  return { drangmomenten: computed(() => appData.value.drang), perWeekdag, logDrang }
}
