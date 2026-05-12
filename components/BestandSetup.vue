<script setup lang="ts">
const { maakNieuwBestand, kiesBestaandBestand, ondersteund } = useStorage()

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
</script>

<template>
  <div class="max-w-sm mx-auto px-4 py-10">
    <h1 class="g-title">gelukt</h1>

    <template v-if="ondersteund">
      <p class="g-body mb-4">
        Kies waar je data opgeslagen wordt. De app schrijft bij elke wijziging naar dat bestand.
      </p>

      <div class="g-infobox mb-6">
        <p><strong>Tip:</strong> sla het bestand op in een cloudmap op je computer.</p>
        <p>Dan synchroniseert het automatisch naar al je toestellen — sync én backup in één.</p>
        <p class="text-stone-500">Voorbeelden: iCloud Drive, Google Drive, OneDrive, Dropbox.</p>
        <p>Op een ander toestel: open gelukt.be en kies "bestaand bestand openen".</p>
      </div>

      <div class="flex flex-col gap-3">
        <button @click="nieuw" :disabled="bezig" class="g-btn text-left">
          nieuw bestand aanmaken
          <div class="g-meta mt-0.5">eerste keer</div>
        </button>
        <button @click="bestaand" :disabled="bezig" class="g-btn text-left">
          bestaand bestand openen
          <div class="g-meta mt-0.5">ander toestel, of eerder aangemaakt</div>
        </button>
      </div>
    </template>

    <template v-else>
      <p class="g-body mb-3">Jouw browser slaat data op in de browseropslag van dit toestel.</p>
      <p class="g-meta mb-6">
        De data verlaat dit toestel niet. Wil je overzetten naar een ander toestel?
        Gebruik de exportfunctie op de profielpagina.
      </p>
      <NuxtLink to="/" class="g-btn inline-block">verder</NuxtLink>
    </template>

    <p v-if="fout" class="g-meta mt-3">fout: {{ fout }}</p>
  </div>
</template>
