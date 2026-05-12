<script setup lang="ts">
const router = useRouter()
const tonen = ref(false)
const stap = ref(1)

onMounted(() => {
  if (!localStorage.getItem('gelukt-intro-gezien')) {
    tonen.value = true
  }
})

function sluit() {
  localStorage.setItem('gelukt-intro-gezien', 'true')
  tonen.value = false
}

function stelIn() {
  sluit()
  router.push('/profiel#data-sync')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="tonen" class="fixed inset-0 bg-paper z-50 flex items-center justify-center p-6">
      <div class="max-w-sm w-full">

        <!-- Stap 1: wat is gelukt -->
        <template v-if="stap === 1">
          <h1 class="g-title">gelukt</h1>

          <p class="g-body mb-4">Dit is een hulpmiddel — niet de oplossing.</p>

          <p class="g-body mb-4">
            Gelukt helpt je bijhouden hoe het gaat: je streak, triggers en
            drangmomenten. Eerlijk zijn met jezelf is een eerste stap.
          </p>

          <p class="g-body mb-10">
            De strijd zelf vraagt gebed, gemeenschap en de genade van God.
            Gebruik dit als middel op weg — niet als doel.
          </p>

          <div class="flex items-center justify-between">
            <button @click="stap = 2" class="g-btn-solid">verder</button>
            <p class="g-meta">1 / 2</p>
          </div>
        </template>

        <!-- Stap 2: hoe werkt sync -->
        <template v-else>
          <h1 class="g-title">jouw data</h1>

          <p class="g-body mb-4">
            Alles wat je invoert staat op dit toestel — geen server, geen account.
            Niemand kan jouw data zien, ook wij niet.
          </p>

          <p class="g-body mb-4">
            Wil je de app op meerdere toestellen gebruiken, of een backup?
            Sla je databestand op in een cloudmap zoals iCloud Drive, Google Drive
            of Dropbox. De app schrijft er automatisch naartoe bij elke wijziging.
          </p>

          <p class="g-meta mb-10">
            Je kan dit ook later instellen via profiel → data &amp; sync.
          </p>

          <div class="flex items-center justify-between">
            <div class="flex gap-3">
              <button @click="stelIn" class="g-btn-solid">stel nu in</button>
              <button @click="sluit" class="g-btn">sla over</button>
            </div>
            <p class="g-meta">2 / 2</p>
          </div>
        </template>

      </div>
    </div>
  </Teleport>
</template>
