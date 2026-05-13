<script setup lang="ts">
import {
  ChevronDown, Trash2, Pencil, RefreshCw, Download, Upload,
  Plus, Bell, Database, Moon, Sun, BarChart2,
} from 'lucide-vue-next'
import { TEKSTEN } from '~/data/teksten'

useSeoMeta({
  title: 'Gelukt — Profiel',
  description: 'Jouw redenen, triggers en statistieken. Beheer je data.',
})

const { plan, voegRedenToe, verwijderReden, updateReden } = usePlan()
const { gesorteerd, voegToe, verwijder } = useTriggers()
const { data: streakData, aantalDagen, langsteStreak, totaalDagen } = useStreak()
const { perWeekdag } = useUrges()
const {
  exporteerData, importeerData, verwijderAlles, verversVanBestand,
  bestandGekoppeld, bestandNaam, kiesBestaandBestand, maakNieuwBestand, ondersteund,
} = useStorage()
const {
  ondersteund: meldingOndersteund, instellingen, toestemming,
  vraagToestemming: vraagMeldingToestemming, slaOp: slaaMeldingenOp,
} = useMeldingen()
const { donker, wissel: wisselThema } = useThema()
const route = useRoute()
const flashSectie = ref('')

onMounted(() => {
  if (route.query.sectie === 'sync') {
    open.instellingen = true
    nextTick(() => {
      setTimeout(() => {
        document.getElementById('data-sync')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        flashSectie.value = 'sync'
        setTimeout(() => (flashSectie.value = ''), 2000)
      }, 350) // wacht tot v-show de DOM heeft bijgewerkt
    })
  }
})

// Inklapbare secties
const open = reactive({
  stats: true,
  redenen: true,
  triggers: true,
  instellingen: false,
  verwijderen: false,
})

// Mijn redenen
const nieuweReden = ref('')
const bewerkIndex = ref<number | null>(null)
const bewerkWaarde = ref('')

function voegRedenToeActie() {
  if (!nieuweReden.value.trim()) return
  voegRedenToe(nieuweReden.value)
  nieuweReden.value = ''
}

function startBewerken(i: number) {
  bewerkIndex.value = i
  bewerkWaarde.value = plan.value.redenen[i]
}

function slaBewerking(i: number) {
  if (bewerkWaarde.value.trim()) updateReden(i, bewerkWaarde.value)
  bewerkIndex.value = null
}

// Triggers
const nieuweNaam = ref('')

function voegTriggerToe() {
  if (!nieuweNaam.value.trim()) return
  voegToe(nieuweNaam.value)
  nieuweNaam.value = ''
}

// Stats
const weekdagen = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']
const maxDrang = computed(() => Math.max(...perWeekdag.value, 1))
const meestVoorkomendeTrigger = computed(() => gesorteerd.value[0])

// Data & sync
const bestandBezig = ref(false)
const verversBezig = ref(false)
const importFout = ref('')
const verversSucces = ref(false)
const bevestigVerwijder = ref(false)

async function koppelBestand() {
  bestandBezig.value = true
  await kiesBestaandBestand()
  bestandBezig.value = false
}

async function nieuwBestand() {
  bestandBezig.value = true
  await maakNieuwBestand()
  bestandBezig.value = false
}

async function ververs() {
  verversBezig.value = true
  const ok = await verversVanBestand()
  verversBezig.value = false
  if (ok) {
    verversSucces.value = true
    setTimeout(() => (verversSucces.value = false), 2000)
  }
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.[0]) return
  importFout.value = ''
  try {
    await importeerData(input.files[0])
    input.value = ''
  } catch (e: unknown) {
    importFout.value = (e as Error).message
  }
}

async function bevestigEnVerwijder() {
  await verwijderAlles()
  bevestigVerwijder.value = false
}

// Meldingen
const meldingFormulier = ref({ ...instellingen.value })
const meldingOpgeslagen = ref(false)

function toonIntro() {
  if (!process.client) return
  localStorage.removeItem('gelukt-intro-gezien')
  const introTonen = useState('introTonen')
  const introStap = useState('introStap')
  introStap.value = 1
  introTonen.value = true
}

async function slaaMeldingenOpEnToets() {
  if (toestemming.value !== 'granted') {
    const ok = await vraagMeldingToestemming()
    if (!ok) return
  }
  await slaaMeldingenOp(meldingFormulier.value)
  meldingOpgeslagen.value = true
  setTimeout(() => (meldingOpgeslagen.value = false), 2000)
}
</script>

<template>
  <div>
    <h1 class="g-title">profiel</h1>

    <!-- ── Statistieken ── -->
    <section class="mb-6">
      <button class="g-section-header" @click="open.stats = !open.stats">
        <div class="flex items-center gap-2"><BarChart2 :size="12" /><span>statistieken</span></div>
        <ChevronDown :size="14" :class="{ 'rotate-180': open.stats }" class="transition-transform" />
      </button>
      <div v-show="open.stats" class="mt-3">
        <div class="mb-4">
          <div class="flex justify-between g-body mb-2">
            <span class="text-stone-500">huidige streak</span>
            <span class="g-kleur-streak">{{ aantalDagen }} {{ aantalDagen === 1 ? 'dag' : 'dagen' }}</span>
          </div>
          <div class="flex justify-between g-body mb-2">
            <span class="text-stone-500">langste streak</span>
            <span class="g-kleur-streak">{{ langsteStreak }} {{ langsteStreak === 1 ? 'dag' : 'dagen' }}</span>
          </div>
          <div class="flex justify-between g-body mb-2">
            <span class="text-stone-500">totaal bijgehouden</span>
            <span>{{ totaalDagen }} {{ totaalDagen === 1 ? 'dag' : 'dagen' }}</span>
          </div>
          <div class="flex justify-between g-body">
            <span class="text-stone-500">terugvallen</span>
            <span class="g-kleur-gevallen">{{ streakData.terugvallen.length }}</span>
          </div>
        </div>
        <div class="mb-3">
          <p class="g-meta mb-2">drang per weekdag</p>
          <div v-for="(dag, i) in weekdagen" :key="dag" class="flex items-center gap-2 mb-1 text-xs">
            <span class="w-4">{{ dag }}</span>
            <div class="flex-1 h-3 bg-white dark:bg-surface">
              <div class="g-bg-drang h-3" :style="{ width: `${(perWeekdag[i] / maxDrang) * 100}%` }" />
            </div>
            <span class="w-3 text-right">{{ perWeekdag[i] }}</span>
          </div>
        </div>
        <div v-if="meestVoorkomendeTrigger && meestVoorkomendeTrigger.aantalKeer > 0">
          <p class="g-meta mb-1">meest voorkomende trigger</p>
          <p class="g-body">{{ meestVoorkomendeTrigger.naam }} ({{ meestVoorkomendeTrigger.aantalKeer }}×)</p>
        </div>
      </div>
    </section>

    <div class="g-divider" />

    <!-- ── Mijn redenen ── -->
    <section class="mb-6">
      <button class="g-section-header" @click="open.redenen = !open.redenen">
        <span>mijn redenen</span>
        <ChevronDown :size="14" :class="{ 'rotate-180': open.redenen }" class="transition-transform" />
      </button>
      <div v-show="open.redenen" class="mt-3">
        <p class="g-meta mb-3">Waarom wil je stoppen? Zichtbaar als je een drang noteert.</p>
        <div v-for="(reden, i) in plan.redenen" :key="i" class="mb-2">
          <template v-if="bewerkIndex === i">
            <input v-model="bewerkWaarde" type="text" class="g-input"
              @keydown.enter="slaBewerking(i)" @keydown.escape="bewerkIndex = null" autofocus />
            <div class="flex gap-3 mt-1">
              <button @click="slaBewerking(i)" class="g-link">opslaan</button>
              <button @click="bewerkIndex = null" class="g-link">annuleer</button>
            </div>
          </template>
          <template v-else>
            <div class="flex justify-between items-start">
              <span class="g-body">— {{ reden }}</span>
              <div class="flex gap-2 ml-4 shrink-0">
                <button @click="startBewerken(i)" class="g-link"><Pencil :size="12" /></button>
                <button @click="verwijderReden(i)" class="g-link-danger"><Trash2 :size="12" /></button>
              </div>
            </div>
          </template>
        </div>
        <div class="flex gap-2 mt-2">
          <input v-model="nieuweReden" type="text" placeholder="bijv. voor mijn mentale rust"
            class="g-input flex-1" @keydown.enter="voegRedenToeActie" />
          <button @click="voegRedenToeActie" :disabled="!nieuweReden.trim()" class="g-btn px-3">
            <Plus :size="14" />
          </button>
        </div>
      </div>
    </section>

    <div class="g-divider" />

    <!-- ── Triggers ── -->
    <section class="mb-6">
      <button class="g-section-header" @click="open.triggers = !open.triggers">
        <span>triggers</span>
        <ChevronDown :size="14" :class="{ 'rotate-180': open.triggers }" class="transition-transform" />
      </button>
      <div v-show="open.triggers" class="mt-3">
        <p class="g-meta mb-3">
          Wat lokt een drang uit? Bijv. een gevoel (vermoeidheid, stress),
          situatie (alleen thuis, laat op), tijdstip of omgeving.
        </p>
        <div v-if="gesorteerd.length > 0" class="mb-3">
          <div v-for="t in gesorteerd" :key="t.id" class="flex justify-between items-center mb-2">
            <span class="g-body">{{ t.naam }}</span>
            <div class="flex items-center gap-3 shrink-0 ml-4">
              <span class="g-meta">{{ t.aantalKeer }}×</span>
              <button @click="verwijder(t.id)" class="g-link-danger"><Trash2 :size="12" /></button>
            </div>
          </div>
        </div>
        <div class="flex gap-2">
          <input v-model="nieuweNaam" type="text" placeholder="naam van de trigger"
            class="g-input flex-1" @keydown.enter="voegTriggerToe" />
          <button @click="voegTriggerToe" :disabled="!nieuweNaam.trim()" class="g-btn px-3">
            <Plus :size="14" />
          </button>
        </div>
      </div>
    </section>

    <div class="g-divider" />

    <!-- ── Instellingen (thema + meldingen + data) ── -->
    <section class="mb-6">
      <button class="g-section-header" @click="open.instellingen = !open.instellingen">
        <span>instellingen</span>
        <ChevronDown :size="14" :class="{ 'rotate-180': open.instellingen }" class="transition-transform" />
      </button>

      <div v-show="open.instellingen" class="mt-3">

        <!-- Info -->
        <div class="py-3 border-b border-stone-200 dark:border-stone-700">
          <button class="flex items-center justify-between w-full" @click="toonIntro">
            <span class="g-body">hoe werkt gelukt?</span>
            <span class="g-meta">bekijk introductie</span>
          </button>
        </div>

        <!-- Thema -->
        <div class="py-3 border-b border-stone-200 dark:border-stone-700">
          <label class="flex items-center justify-between cursor-pointer" @click.prevent="wisselThema">
            <div class="flex items-center gap-2 g-body">
              <Moon v-if="donker" :size="14" />
              <Sun v-else :size="14" />
              {{ donker ? 'donker thema' : 'licht thema' }}
            </div>
            <div class="g-toggle"
              :class="donker ? 'bg-black dark:bg-paper' : 'bg-stone-300 dark:bg-stone-600'">
              <div class="g-toggle-knob"
                :class="donker
                  ? 'left-6 bg-paper dark:bg-black'
                  : 'left-1 bg-white dark:bg-stone-300'" />
            </div>
          </label>
        </div>

        <!-- Meldingen -->
        <div class="py-3 border-b border-stone-200 dark:border-stone-700">
          <p v-if="!meldingOndersteund" class="g-meta">Niet beschikbaar in deze browser.</p>
          <p v-else-if="toestemming === 'denied'" class="g-meta">Geblokkeerd — pas aan in browserinstellingen.</p>
          <template v-else>
            <label class="flex items-center justify-between cursor-pointer"
              @click.prevent="meldingFormulier.aktief = !meldingFormulier.aktief">
              <div class="flex items-center gap-2 g-body">
                <Bell :size="14" />
                meldingen
              </div>
              <div class="g-toggle"
                :class="meldingFormulier.aktief ? 'bg-black dark:bg-paper' : 'bg-stone-300 dark:bg-stone-600'">
                <div class="g-toggle-knob"
                  :class="meldingFormulier.aktief
                    ? 'left-6 bg-paper dark:bg-black'
                    : 'left-1 bg-white dark:bg-stone-300'" />
              </div>
            </label>
            <div v-if="meldingFormulier.aktief" class="mt-3 space-y-3">
              <div>
                <label class="g-label">tijdstip</label>
                <input v-model="meldingFormulier.tijdstip" type="time" class="g-input w-auto" />
              </div>
              <div>
                <label class="g-label">hoe vaak</label>
                <div class="flex flex-col gap-2">
                  <label v-for="opt in [
                    { waarde: 'dagelijks', label: 'elke dag' },
                    { waarde: 'werkdagen', label: 'werkdagen (ma–vr)' },
                    { waarde: 'weekend',   label: 'weekend (za–zo)' },
                  ]" :key="opt.waarde" class="flex items-center gap-2 g-body cursor-pointer">
                    <input type="radio" :value="opt.waarde" v-model="meldingFormulier.frequentie" class="accent-black dark:accent-paper" />
                    {{ opt.label }}
                  </label>
                </div>
              </div>
              <button @click="slaaMeldingenOpEnToets" class="g-btn">
                <span :class="meldingOpgeslagen ? 'text-green-700 dark:text-green-500' : ''">
                  {{ meldingOpgeslagen ? 'opgeslagen ✓' : 'opslaan' }}
                </span>
              </button>
            </div>
          </template>
        </div>

        <!-- Data -->
        <div id="data-sync" class="py-3" :class="{ 'g-flash': flashSectie === 'sync' }">

          <template v-if="!bestandGekoppeld">
            <!-- Stap 1: nog geen bestand -->
            <p class="g-meta mb-3">{{ TEKSTEN.syncUitleg }}</p>
            <p class="g-meta mb-4">{{ TEKSTEN.cloudVoorbeelden }}</p>

            <template v-if="ondersteund">
              <div class="flex flex-col gap-2">
                <button @click="nieuwBestand" :disabled="bestandBezig" class="g-btn flex items-center gap-2">
                  <Plus :size="14" /> nieuw bestand aanmaken
                </button>
                <button @click="koppelBestand" :disabled="bestandBezig" class="g-btn flex items-center gap-2">
                  <Database :size="14" /> bestaand bestand koppelen
                </button>
              </div>
            </template>

            <template v-else>
              <p class="g-meta mb-3">{{ TEKSTEN.browserGeenSupport }}</p>
              <div class="flex flex-col gap-2">
                <button @click="exporteerData" class="g-btn flex items-center gap-2">
                  <Download :size="14" /> download data
                </button>
                <label class="g-btn flex items-center gap-2">
                  <input type="file" accept=".json" class="hidden" @change="handleImport" />
                  <Upload :size="14" /> importeer data
                </label>
              </div>
            </template>
          </template>

          <template v-else>
            <!-- Stap 2: bestand gekoppeld -->
            <p class="g-body mb-1">{{ bestandNaam }}</p>
            <p class="g-meta mb-4">Wordt automatisch opgeslagen bij elke wijziging.</p>

            <div class="flex flex-col gap-2">
              <button @click="ververs" :disabled="verversBezig" class="g-btn flex items-center gap-2">
                <RefreshCw :size="14" />
                <span :class="verversSucces ? 'text-green-700 dark:text-green-500' : ''">
                  {{ verversSucces ? 'gesynchroniseerd ✓' : 'synchroniseer' }}
                </span>
              </button>
              <button @click="exporteerData" class="g-btn flex items-center gap-2">
                <Download :size="14" /> download kopie
              </button>
              <label class="g-btn flex items-center gap-2">
                <input type="file" accept=".json" class="hidden" @change="handleImport" />
                <Upload :size="14" /> importeer data
              </label>
              <button v-if="ondersteund" @click="koppelBestand" :disabled="bestandBezig"
                class="g-link flex items-center gap-1 mt-1">
                <Database :size="11" /> ander bestand kiezen
              </button>
            </div>
            <p v-if="importFout" class="g-meta mt-2">fout: {{ importFout }}</p>
          </template>

        </div>

      </div>
    </section>

    <div class="g-divider" />

    <!-- ── Verwijderen ── -->
    <section class="mb-8">
      <button class="g-section-header" @click="open.verwijderen = !open.verwijderen">
        <span class="text-red-600">verwijderen</span>
        <ChevronDown :size="14" :class="{ 'rotate-180': open.verwijderen }" class="transition-transform text-red-600" />
      </button>
      <div v-show="open.verwijderen" class="mt-3">
        <p class="g-meta mb-3">Verwijdert alle data: streak, drangmomenten, triggers en redenen.</p>
        <template v-if="!bevestigVerwijder">
          <button @click="bevestigVerwijder = true" class="g-btn-danger flex items-center gap-2">
            <Trash2 :size="14" /> alles verwijderen
          </button>
        </template>
        <template v-else>
          <p class="g-body mb-3">Weet je het zeker? Dit kan niet ongedaan worden.</p>
          <div class="flex gap-3">
            <button @click="bevestigEnVerwijder" class="g-btn-danger-solid flex items-center gap-2">
              <Trash2 :size="14" /> ja, verwijder alles
            </button>
            <button @click="bevestigVerwijder = false" class="g-btn">annuleer</button>
          </div>
        </template>
      </div>
    </section>

    <div class="border-t border-black dark:border-stone-700 pt-4 flex justify-between items-center">
      <NuxtLink to="/privacy" class="g-meta hover:underline">privacybeleid</NuxtLink>
      <span class="g-meta">v{{ $config.public.versie }}</span>
    </div>
  </div>
</template>
