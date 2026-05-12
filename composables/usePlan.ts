export function usePlan() {
  const { appData, slaAllesOp } = useStorage()
  const plan = computed(() => appData.value.plan)

  async function voegRedenToe(reden: string) {
    appData.value.plan.redenen.push(reden.trim())
    await slaAllesOp()
  }

  async function verwijderReden(index: number) {
    appData.value.plan.redenen.splice(index, 1)
    await slaAllesOp()
  }

  async function updateReden(index: number, waarde: string) {
    appData.value.plan.redenen[index] = waarde.trim()
    await slaAllesOp()
  }

  return { plan, voegRedenToe, verwijderReden, updateReden }
}
