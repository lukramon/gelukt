<template>
  <div class="min-h-screen">
    <IntroScherm />

    <template v-if="toonSetup">
      <BestandSetup />
    </template>

    <template v-else>
      <main class="max-w-sm mx-auto px-4 py-6 pb-20">
        <NuxtPage />
      </main>

      <nav class="fixed bottom-0 left-0 right-0 bg-paper dark:bg-black border-t border-black dark:border-stone-700">
        <div class="max-w-sm mx-auto py-2 flex">
          <NuxtLink to="/" class="flex flex-col items-center gap-0.5 text-xs font-bold w-1/3"
            :class="route.path === '/' ? '' : 'opacity-40 hover:opacity-70'">
            <Sun :size="18" :stroke-width="1.5" />
            <span>vandaag</span>
          </NuxtLink>
          <NuxtLink to="/inspiratie" class="flex flex-col items-center gap-0.5 text-xs font-bold w-1/3"
            :class="route.path === '/inspiratie' ? '' : 'opacity-40 hover:opacity-70'">
            <BookOpen :size="18" :stroke-width="1.5" />
            <span>inspiratie</span>
          </NuxtLink>
          <NuxtLink to="/profiel" class="flex flex-col items-center gap-0.5 text-xs font-bold w-1/3"
            :class="route.path === '/profiel' ? '' : 'opacity-40 hover:opacity-70'">
            <User :size="18" :stroke-width="1.5" />
            <span>profiel</span>
          </NuxtLink>
        </div>
      </nav>
    </template>
  </div>
</template>

<script setup lang="ts">
import { Sun, BookOpen, User } from 'lucide-vue-next'

const route = useRoute()
const { initialiseer, bestandGekoppeld, bestandNaam, toestemmingNodig, ondersteund, vraagToestemming } = useStorage()
const { laden: laadMeldingen, stuurNaarSW } = useMeldingen()
const { initialiseer: initThema } = useThema()

const geladen = ref(false)
const toonSetup = computed(() => geladen.value && ondersteund && !bestandGekoppeld.value)

onMounted(async () => {
  initThema()
  await initialiseer()
  geladen.value = true
  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('/sw.js') } catch {}
  }
  laadMeldingen()
  await stuurNaarSW()
})
</script>
