<script setup lang="ts">
import { TEKSTEN } from '~/data/teksten'
const { maakNieuwBestand, kiesBestaandBestand, ondersteund, toestemmingNodig, vraagToestemming } = useStorage()

const bezig = ref(false)
const fout = ref('')

async function nieuw() {
  bezig.value = true
  fout.value = ''
  try { await maakNieuwBestand() }
  catch (e: unknown) { fout.value = (e as Error).message }
  finally { bezig.value = false }
}

async function bestaand() {
  bezig.value = true
  fout.value = ''
  try { await kiesBestaandBestand() }
  catch (e: unknown) { fout.value = (e as Error).message }
  finally { bezig.value = false }
}

async function herverbind() {
  bezig.value = true
  fout.value = ''
  const ok = await vraagToestemming()
  if (!ok) fout.value = 'Toestemming geweigerd. Probeer opnieuw.'
  bezig.value = false
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-sm">
      <h1 class="g-title">gelukt</h1>

      <!-- Herverbinden na sessieherstart -->
      <template v-if="toestemmingNodig">
        <p class="g-body mb-4">
          De browser heeft toestemming nodig om je databestand te lezen.
          Dit is een beveiligingsmaatregel van de browser — de app kan dit niet omzeilen.
        </p>
        <p class="g-meta mb-6">
          Klik hieronder om de verbinding te herstellen. De browser zal vragen
          om toegang tot het bestand dat je eerder hebt gekoppeld.
        </p>
        <button @click="herverbind" :disabled="bezig" class="g-btn-solid">
          verbind opnieuw
        </button>
      </template>

      <!-- Eerste keer instellen -->
      <template v-else-if="ondersteund">
        <p class="g-body mb-4">{{ TEKSTEN.syncUitleg }}</p>

        <p class="g-meta mb-6">{{ TEKSTEN.cloudVoorbeelden }}</p>

        <div class="flex flex-col gap-3 mb-6">
          <button @click="nieuw" :disabled="bezig" class="g-btn text-left">
            nieuw bestand aanmaken
            <div class="g-meta mt-0.5">eerste keer</div>
          </button>
          <button @click="bestaand" :disabled="bezig" class="g-btn text-left">
            bestaand bestand openen
            <div class="g-meta mt-0.5">ander toestel, of eerder aangemaakt</div>
          </button>
        </div>

        <p class="g-meta">{{ TEKSTEN.bestandsToestemming }}</p>
      </template>

      <!-- Browser zonder ondersteuning -->
      <template v-else>
        <p class="g-body mb-3">Jouw browser slaat data op in de browseropslag van dit toestel.</p>
        <p class="g-meta mb-6">{{ TEKSTEN.browserGeenSupport }}</p>
        <NuxtLink to="/" class="g-btn inline-block">verder</NuxtLink>
      </template>

      <p v-if="fout" class="g-meta mt-3">{{ fout }}</p>
    </div>
  </div>
</template>
