// Beheer deze lijst zelf — voeg toe, verwijder, pas aan.
// Gebruikers zien dit en kunnen items opslaan, maar kunnen zelf niets toevoegen.
// Laat url leeg als er geen link is.

export type BronType = 'video' | 'artikel' | 'boek' | 'podcast' | 'website' | 'muziek' | 'app'

export interface Bron {
  id: string
  titel: string
  type: BronType
  auteur?: string
  beschrijving?: string
  url?: string
  isbn?: string
}

export const BRONNEN: Bron[] = [
  // ── Websites ──────────────────────────────────────────────────────────────
  {
    id: '1',
    titel: "I'll Be Honest — Tim Conway",
    type: 'website',
    auteur: 'Tim Conway',
    beschrijving: 'Bijbelse preken en onderwijs over heilig leven. Meer dan 1000 berichten.',
    url: 'https://illbehonest.com/author/tim-conway',
  },

  // ── Video's ────────────────────────────────────────────────────────────────
  {
    id: '2',
    titel: 'Desexualizing Your Brain & My Father\'s Suicide',
    type: 'video',
    auteur: 'The Conscious Man',
    url: 'https://www.youtube.com/watch?v=MrwM4BHz1eo',
  },
  {
    id: '3',
    titel: '7 Biblical Ways To Retain Your Seed',
    type: 'video',
    auteur: 'Spiritual Neezy',
    url: 'https://www.youtube.com/watch?v=CUoaRKWNXTo',
  },
  {
    id: '4',
    titel: "'Ik ben te zwak, ik ben pornoverslaafd.' — Roep tot God!",
    type: 'video',
    auteur: 'Evangelie Herauten',
    url: 'https://www.youtube.com/watch?v=azCtnnP_cWQ',
  },
  {
    id: '5',
    titel: 'Your Greatest Weapon Against Temptation',
    type: 'video',
    auteur: 'John Piper',
    url: 'https://www.youtube.com/shorts/OEfoxUV4Zjg',
  },
  {
    id: '6',
    titel: 'Seksuele onreinheid en pornografie — De strijd tegen de zonde',
    type: 'video',
    auteur: 'Tim Conway',
    url: 'https://www.youtube.com/watch?v=7ZZGytS8fZA&list=PLB13qtv3iBtoUOIIUa3xfno9QXeNEhd3H&index=8',
  },

  // ── Apps ──────────────────────────────────────────────────────────────────
  {
    id: '9',
    titel: 'Covenant Eyes',
    type: 'app',
    beschrijving: 'Accountability-software die je internetgebruik deelt met een vertrouwenspersoon. Beschikbaar op alle toestellen.',
    url: 'https://www.covenanteyes.com',
  },
  {
    id: '10',
    titel: 'Ever Accountable',
    type: 'app',
    beschrijving: 'Monitort je schermgebruik en stuurt automatisch rapporten naar een accountabilitypartner.',
    url: 'https://everaccountable.com',
  },

  // ── Boeken ─────────────────────────────────────────────────────────────────
  {
    id: '11',
    titel: 'Als zonde mij omringt',
    type: 'boek',
    auteur: 'John Owen',
    beschrijving: 'Nederlandse vertaling van "The Mortification of Sin". Klassiek Puriteins werk over de strijd tegen en overwinning op zonde.',
    url: 'https://www.bol.com/nl/nl/f/als-zonde-mij-omringt/9200000001438373/',
    isbn: '978-90-336-3345-4',
  },
  {
    id: '14',
    titel: 'The Mortification of Sin',
    type: 'boek',
    auteur: 'John Owen',
    beschrijving: 'Engelse editie. Origineel Puriteins werk, beschikbaar via Banner of Truth.',
    url: 'https://banneroftruth.org/us/store/christian-living/the-mortification-of-sin/',
    isbn: '978-0-85151-867-1',
  },
  {
    id: '12',
    titel: 'The Porn Myth',
    type: 'boek',
    auteur: 'Matt Fradd',
    beschrijving: 'Ontkracht gangbare misvattingen over pornografie en legt de werkelijke impact bloot.',
    url: 'https://ignatius.com/the-porn-myth-pomyp/',
    isbn: '978-1-62164-006-6',
  },

  // ── Muziek ─────────────────────────────────────────────────────────────────
  {
    id: '7',
    titel: 'More',
    type: 'muziek',
    auteur: 'Jimmy Clifton',
    url: 'https://www.youtube.com/watch?v=WaVV-x4a1R8',
  },
  {
    id: '8',
    titel: 'Rehab',
    type: 'muziek',
    auteur: 'Lecrae',
    url: 'https://www.youtube.com/watch?v=gNEWb_0SHGg',
  },
  {
    id: '13',
    titel: 'Killing Sin',
    type: 'muziek',
    auteur: 'Timothy Brindle',
    beschrijving: 'Volledig album.',
    url: 'https://www.youtube.com/playlist?list=OLAK5uy_nUvwnOAQvjpp2swaG7apvzYXCT3csvELU',
  },
]
