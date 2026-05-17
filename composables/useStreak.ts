import type { Terugval } from '~/types/recovery'

export function useStreak() {
  const { appData, slaAllesOp } = useStorage()
  const data = computed(() => appData.value.streak)

  const aantalDagen = computed(() =>
    Math.floor((Date.now() - new Date(data.value.beginDatum).getTime()) / 86_400_000)
  )

  const langsteStreak = computed(() => {
    const t = [...data.value.terugvallen].sort(
      (a, b) => new Date(a.datumTijd).getTime() - new Date(b.datumTijd).getTime()
    )
    if (t.length === 0) return aantalDagen.value

    let max = Math.floor(
      (new Date(t[0].datumTijd).getTime() - new Date(data.value.eersteBeginDatum).getTime()) / 86_400_000
    )
    for (let i = 1; i < t.length; i++) {
      max = Math.max(max, Math.floor(
        (new Date(t[i].datumTijd).getTime() - new Date(t[i - 1].datumTijd).getTime()) / 86_400_000
      ))
    }
    return Math.max(max, aantalDagen.value)
  })

  const totaalDagen = computed(() =>
    Math.floor((Date.now() - new Date(data.value.eersteBeginDatum).getTime()) / 86_400_000)
  )

  async function registreerTerugval(terugval: Omit<Terugval, 'id'>) {
    appData.value.streak.terugvallen.push({ id: Date.now().toString(), ...terugval })
    appData.value.streak.beginDatum = terugval.datumTijd
    await slaAllesOp()
  }

  return { data, aantalDagen, langsteStreak, totaalDagen, registreerTerugval }
}
