const LS_SLEUTEL = 'gelukt-donker'

export function useThema() {
  const donker = useState<boolean>('donker', () => false)

  function initialiseer() {
    if (!process.client) return
    const opgeslagen = localStorage.getItem(LS_SLEUTEL)
    donker.value = opgeslagen !== null
      ? opgeslagen === 'true'
      : window.matchMedia('(prefers-color-scheme: dark)').matches
    passToe()
  }

  function passToe() {
    if (!process.client) return
    document.documentElement.classList.toggle('dark', donker.value)
  }

  function wissel() {
    donker.value = !donker.value
    localStorage.setItem(LS_SLEUTEL, String(donker.value))
    passToe()
  }

  return { donker, initialiseer, wissel }
}
