export interface Terugval {
  id: string
  datumTijd: string
  triggerId?: string
  triggerNaam?: string
  notitie?: string
}

export interface StreakData {
  eersteBeginDatum: string
  beginDatum: string
  terugvallen: Terugval[]
}

export type TriggerCategorie = 'gevoel' | 'situatie' | 'tijdstip' | 'omgeving'

export interface Trigger {
  id: string
  naam: string
  categorie?: TriggerCategorie
  aantalKeer: number
}

export interface Drang {
  id: string
  datumTijd: string
  intensiteit: number
  triggerId?: string
  triggerNaam?: string
}

export interface Plan {
  redenen: string[]
}

export interface SuccesvolDag {
  id: string
  datumTijd: string
  notitie?: string
}

export interface AppData {
  versie: string
  streak: StreakData
  triggers: Trigger[]
  drang: Drang[]
  plan: Plan
  opgeslagenBronnen: string[]
  succesvolleDagen: SuccesvolDag[]
}
