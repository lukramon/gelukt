import type { Terugval } from '~/types/recovery'

// Counts calendar days between two dates (midnight to midnight, local time).
// Today is NOT yet counted — only days that have fully passed.
function calendarDagen(van: Date, naar: Date): number {
  const vanDag = new Date(van.getFullYear(), van.getMonth(), van.getDate())
  const naarDag = new Date(naar.getFullYear(), naar.getMonth(), naar.getDate())
  return Math.round((naarDag.getTime() - vanDag.getTime()) / 86_400_000)
}

export function useStreak() {
  const { appData, slaAllesOp } = useStorage()
  const data = computed(() => appData.value.streak)

  const aantalDagen = computed(() =>
    calendarDagen(new Date(data.value.beginDatum), new Date())
  )

  const langsteStreak = computed(() => {
    const t = [...data.value.terugvallen].sort(
      (a, b) => new Date(a.datumTijd).getTime() - new Date(b.datumTijd).getTime()
    )
    if (t.length === 0) return aantalDagen.value

    let max = calendarDagen(new Date(data.value.eersteBeginDatum), new Date(t[0].datumTijd))
    for (let i = 1; i < t.length; i++) {
      max = Math.max(max, calendarDagen(new Date(t[i - 1].datumTijd), new Date(t[i].datumTijd)))
    }
    return Math.max(max, aantalDagen.value)
  })

  const totaalDagen = computed(() =>
    calendarDagen(new Date(data.value.eersteBeginDatum), new Date())
  )

  async function registreerTerugval(terugval: Omit<Terugval, 'id'>) {
    appData.value.streak.terugvallen.push({ id: Date.now().toString(), ...terugval })
    appData.value.streak.beginDatum = terugval.datumTijd
    await slaAllesOp()
  }

  return { data, aantalDagen, langsteStreak, totaalDagen, registreerTerugval }
}
