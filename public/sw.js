// Service Worker — Gelukt
// Beheert geplande meldingen. Bijbelteksten staan hier dubbel omdat
// de SW geen toegang heeft tot de app-modules.

const BIJBELTEKSTEN = [
  { tekst: 'Vlucht voor de hoererij. Elke zonde die de mens doet, is buiten het lichaam, maar wie hoererij bedrijft, zondigt tegen zijn eigen lichaam.', referentie: '1 Korinthe 6:18' },
  { tekst: 'Of weet u niet dat uw lichaam een tempel is van de Heilige Geest, Die in u is en Die u van God hebt ontvangen, en dat u niet van uzelf bent? Want u bent gekocht voor een prijs. Verheerlijk daarom God in uw lichaam en in uw geest, die van God zijn.', referentie: '1 Korinthe 6:19-20' },
  { tekst: 'Onderwerp u dan aan God. Bied weerstand aan de duivel en hij zal van u wegvluchten.', referentie: 'Jakobus 4:7' },
  { tekst: 'Ik zeg u: wandel door de Geest en voldoe niet aan de begeerte van het vlees.', referentie: 'Galaten 5:16' },
  { tekst: 'Schep mij een rein hart, o God, en vernieuw een vaste geest in mijn binnenste.', referentie: 'Psalm 51:12' },
  { tekst: 'Ik vermag alle dingen door Christus, Die mij kracht geeft.', referentie: 'Filippenzen 4:13' },
  { tekst: 'Uw woord heb ik in mijn hart verborgen, opdat ik niet tegen U zondige.', referentie: 'Psalm 119:11' },
  { tekst: 'Maar in dit alles zijn wij meer dan overwinnaars door Hem Die ons heeft liefgehad.', referentie: 'Romeinen 8:37' },
  { tekst: 'De HEERE is nabij de gebrokenen van hart en Hij verlost de verbrijzelden van geest.', referentie: 'Psalm 34:19' },
  { tekst: 'Als wij onze zonden belijden: Hij is getrouw en rechtvaardig om ons de zonden te vergeven en ons te reinigen van alle ongerechtigheid.', referentie: '1 Johannes 1:9' },
]

function getDagelijksTekst() {
  const nu = new Date()
  const dag = Math.floor((nu - new Date(nu.getFullYear(), 0, 0)) / 86_400_000)
  return BIJBELTEKSTEN[dag % BIJBELTEKSTEN.length]
}

function magVandaag(frequentie) {
  const dag = new Date().getDay() // 0=zo, 1=ma … 6=za
  if (frequentie === 'werkdagen') return dag >= 1 && dag <= 5
  if (frequentie === 'weekend')   return dag === 0 || dag === 6
  return true
}

function msTotvolgendeTijd(tijdstip) {
  const [uur, min] = tijdstip.split(':').map(Number)
  const doel = new Date()
  doel.setHours(uur, min, 0, 0)
  if (doel <= new Date()) doel.setDate(doel.getDate() + 1)
  return doel.getTime() - Date.now()
}

let geplandTimeout = null

function planMelding(tijdstip, frequentie) {
  if (geplandTimeout) clearTimeout(geplandTimeout)
  geplandTimeout = setTimeout(async () => {
    if (magVandaag(frequentie)) {
      const vers = getDagelijksTekst()
      await self.registration.showNotification('Gelukt', {
        body: `${vers.tekst}\n\n— ${vers.referentie}`,
        tag: 'gelukt-dagelijks',
        renotify: true,
        data: { tijdstip, frequentie },
      })
    }
    planMelding(tijdstip, frequentie)
  }, msTotvolgendeTijd(tijdstip))
}

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'PLAN_MELDING') return
  const { aktief, tijdstip, frequentie } = event.data
  if (aktief && tijdstip) {
    planMelding(tijdstip, frequentie)
  } else {
    if (geplandTimeout) clearTimeout(geplandTimeout)
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(lijst => {
      if (lijst.length) return lijst[0].focus()
      return clients.openWindow('/')
    })
  )
})

self.addEventListener('install',  () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()))
