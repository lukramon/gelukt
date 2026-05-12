<script setup lang="ts">
import { Plus, TrendingUp, X } from 'lucide-vue-next'

useSeoMeta({
  title: 'Gelukt — PMO Recovery Tracker',
  description: 'Volg je PMO-vrije streak dag voor dag. Volledig privé, geen account, geen server.',
  ogTitle: 'Gelukt — PMO Recovery Tracker',
  ogDescription: 'Persoonlijke recovery tracker. Privé, geen account, geen server.',
  ogType: 'website',
  ogUrl: 'https://gelukt.be',
})

const { data: streakData, aantalDagen, registreerTerugval } = useStreak()
const { gesorteerd: triggerLijst, verhoogTeller } = useTriggers()
const { drangmomenten, logDrang } = useUrges()
const { dagelijksTekst } = useBijbeltekst()

type Stap = 'gesloten' | 'keuze' | 'drang' | 'gevallen'
const stap = ref<Stap>('gesloten')
const intensiteit = ref<number | null>(null)
const gekozenTriggerId = ref('')
const andereTrigger = ref('')
const notitie = ref('')

const geformatteerdeBeginDatum = computed(() =>
  new Date(streakData.value.beginDatum).toLocaleDateString('nl-BE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
)

function reset() {
  stap.value = 'gesloten'
  intensiteit.value = null
  gekozenTriggerId.value = ''
  andereTrigger.value = ''
  notitie.value = ''
}

function haalTriggerId() {
  return gekozenTriggerId.value === 'andere' ? undefined : gekozenTriggerId.value || undefined
}

function haalTriggerNaam() {
  if (gekozenTriggerId.value === 'andere') return andereTrigger.value.trim() || undefined
  return triggerLijst.value.find(t => t.id === gekozenTriggerId.value)?.naam
}

async function slaaDrangOp() {
  if (!intensiteit.value) return
  const tid = haalTriggerId()
  await logDrang(intensiteit.value, tid, haalTriggerNaam())
  if (tid) await verhoogTeller(tid)
  reset()
}

async function bevestigTerugval() {
  const tid = haalTriggerId()
  await registreerTerugval({
    datumTijd: new Date().toISOString(),
    triggerId: tid,
    triggerNaam: haalTriggerNaam(),
    notitie: notitie.value.trim() || undefined,
  })
  if (tid) await verhoogTeller(tid)
  reset()
}

function relatiefDatum(datumTijd: string): string {
  const ms = Date.now() - new Date(datumTijd).getTime()
  const min = Math.floor(ms / 60_000)
  const uur = Math.floor(ms / 3_600_000)
  const dag = Math.floor(ms / 86_400_000)
  if (min < 60) return `${min}m geleden`
  if (uur < 24) return `${uur}u geleden`
  if (dag === 1) return 'gisteren'
  return `${dag} dagen geleden`
}

type ActiviteitItem = {
  id: string; type: 'drang' | 'terugval'
  datumTijd: string; intensiteit?: number
  triggerNaam?: string; relatieveDatum: string
}

const recenteActiviteit = computed((): ActiviteitItem[] =>
  [
    ...drangmomenten.value.map(d => ({
      id: d.id, type: 'drang' as const, datumTijd: d.datumTijd,
      intensiteit: d.intensiteit, triggerNaam: d.triggerNaam,
      relatieveDatum: relatiefDatum(d.datumTijd),
    })),
    ...streakData.value.terugvallen.map(t => ({
      id: t.id, type: 'terugval' as const, datumTijd: t.datumTijd,
      triggerNaam: t.triggerNaam, relatieveDatum: relatiefDatum(t.datumTijd),
    })),
  ]
    .sort((a, b) => new Date(b.datumTijd).getTime() - new Date(a.datumTijd).getTime())
    .slice(0, 5)
)
</script>

<template>
  <div>
    <!-- Bijbeltekst -->
    <section class="g-infobox mb-8">
      <p class="font-bijbel text-base leading-relaxed">{{ dagelijksTekst.tekst }}</p>
      <p class="g-meta mt-1">— {{ dagelijksTekst.referentie }} (HSV)</p>
    </section>

    <!-- Streak + check in samen -->
    <section class="mb-8">
      <div class="text-7xl font-bold tabular-nums leading-none g-kleur-streak">{{ aantalDagen }}</div>
      <p class="g-body mt-2">{{ aantalDagen === 1 ? 'dag' : 'dagen' }}</p>
      <p class="g-meta mt-1 mb-6">gestart {{ geformatteerdeBeginDatum }}</p>

      <button @click="stap = 'keuze'" class="g-btn flex items-center gap-2">
        <Plus :size="14" />
        check in
      </button>
    </section>

    <div class="g-divider" />

    <!-- Recent -->
    <section>
      <h2 class="g-heading">recent</h2>
      <template v-if="recenteActiviteit.length > 0">
        <div v-for="item in recenteActiviteit" :key="item.id" class="flex items-start gap-2 mb-3">
          <TrendingUp v-if="item.type === 'drang'" :size="14" class="g-kleur-drang mt-0.5 shrink-0" />
          <X v-else :size="14" class="g-kleur-gevallen mt-0.5 shrink-0" />
          <div>
            <p class="g-body">
              <span v-if="item.type === 'drang'" class="g-kleur-drang">drang {{ item.intensiteit }}/10</span>
              <span v-else class="g-kleur-gevallen">gevallen</span>
              <span class="text-stone-500"> — {{ item.relatieveDatum }}</span>
            </p>
            <p v-if="item.triggerNaam" class="g-meta">{{ item.triggerNaam }}</p>
          </div>
        </div>
      </template>
      <p v-else class="g-meta">nog niets genoteerd</p>
    </section>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="stap !== 'gesloten'" class="fixed inset-0 bg-paper dark:bg-black z-50 overflow-auto flex flex-col">
        <div class="flex-1 flex items-center justify-center p-6">
          <div class="w-full max-w-sm">

            <!-- Keuze -->
            <template v-if="stap === 'keuze'">
              <h2 class="g-heading">wat wil je noteren?</h2>
              <div class="flex flex-col gap-3 mb-8">
                <button @click="stap = 'drang'" class="g-btn-drang">
                  drang gevoeld
                  <div class="text-xs text-orange-300 mt-0.5">maar niet gevallen</div>
                </button>
                <button @click="stap = 'gevallen'" class="g-btn-danger">
                  gevallen
                  <div class="text-xs text-red-400 mt-0.5">reset de streak</div>
                </button>
              </div>
              <button @click="reset" class="g-link">annuleren</button>
            </template>

            <!-- Drang -->
            <template v-else-if="stap === 'drang'">
              <h2 class="g-heading">drang gevoeld</h2>
              <div class="g-infobox mb-6">
                <p class="font-bijbel text-sm leading-relaxed">{{ dagelijksTekst.tekst }}</p>
                <p class="g-meta mt-1">— {{ dagelijksTekst.referentie }} (HSV)</p>
              </div>
              <div class="mb-6">
                <label class="g-label">hoe sterk?</label>
                <div class="flex flex-wrap gap-2">
                  <button v-for="n in 10" :key="n" @click="intensiteit = n"
                    class="g-btn-sm w-9 h-9 text-center"
                    :class="intensiteit === n ? 'bg-black text-white dark:bg-paper dark:text-black' : ''">
                    {{ n }}
                  </button>
                </div>
                <div class="flex justify-between g-meta mt-1"><span>licht</span><span>zwaar</span></div>
              </div>
              <div class="mb-6">
                <label class="g-label">trigger (optioneel)</label>
                <div v-for="t in triggerLijst" :key="t.id" class="mb-2">
                  <label class="flex items-start gap-2 g-body cursor-pointer">
                    <input type="radio" :value="t.id" v-model="gekozenTriggerId" class="mt-0.5 accent-black dark:accent-paper" />
                    {{ t.naam }}
                  </label>
                </div>
                <label class="flex items-start gap-2 g-body cursor-pointer">
                  <input type="radio" value="andere" v-model="gekozenTriggerId" class="mt-0.5 accent-black dark:accent-paper" />
                  andere
                </label>
                <input v-if="gekozenTriggerId === 'andere'" v-model="andereTrigger"
                  type="text" placeholder="beschrijf de trigger" class="g-input mt-2" />
              </div>
              <div class="flex gap-3">
                <button @click="slaaDrangOp" :disabled="!intensiteit" class="g-btn-solid">opslaan</button>
                <button @click="stap = 'keuze'" class="g-btn">terug</button>
              </div>
            </template>

            <!-- Gevallen -->
            <template v-else-if="stap === 'gevallen'">
              <h2 class="g-heading">gevallen</h2>
              <div class="mb-4">
                <label class="g-label">datum</label>
                <p class="g-body">{{ new Date().toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
              </div>
              <div class="mb-4">
                <label class="g-label">trigger (optioneel)</label>
                <div v-for="t in triggerLijst" :key="t.id" class="mb-2">
                  <label class="flex items-start gap-2 g-body cursor-pointer">
                    <input type="radio" :value="t.id" v-model="gekozenTriggerId" class="mt-0.5 accent-black dark:accent-paper" />
                    {{ t.naam }}
                  </label>
                </div>
                <label class="flex items-start gap-2 g-body cursor-pointer">
                  <input type="radio" value="andere" v-model="gekozenTriggerId" class="mt-0.5 accent-black dark:accent-paper" />
                  andere
                </label>
                <input v-if="gekozenTriggerId === 'andere'" v-model="andereTrigger"
                  type="text" placeholder="beschrijf de trigger" class="g-input mt-2" />
              </div>
              <div class="mb-8">
                <label class="g-label">notitie (optioneel)</label>
                <textarea v-model="notitie" rows="3"
                  placeholder="wat ging er mis, of wat wil je onthouden?" class="g-textarea" />
              </div>
              <div class="flex gap-3">
                <button @click="bevestigTerugval" class="g-btn-solid">bevestigen</button>
                <button @click="stap = 'keuze'" class="g-btn">terug</button>
              </div>
            </template>

          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
