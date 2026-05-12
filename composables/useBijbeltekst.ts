import { BIJBELTEKSTEN } from '~/data/bijbelteksten'

export function useBijbeltekst() {
  const dagelijksTekst = computed(() => {
    const nu = new Date()
    const dagVanHetJaar = Math.floor(
      (nu.getTime() - new Date(nu.getFullYear(), 0, 0).getTime()) / 86_400_000
    )
    return BIJBELTEKSTEN[dagVanHetJaar % BIJBELTEKSTEN.length]
  })

  return { dagelijksTekst }
}
