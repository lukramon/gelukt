<script setup lang="ts">
import { Play, Music, BookOpen, FileText, Globe, Mic, Smartphone, ExternalLink } from 'lucide-vue-next'
import { BRONNEN, type BronType } from '~/data/bronnen'

useSeoMeta({
  title: 'Gelukt — Inspiratie',
  description: 'Aanbevolen boeken, video\'s en artikelen over PMO-herstel.',
})

const LABELS: Record<BronType, string> = {
  app:     'apps',
  website: 'websites',
  video:   "video's",
  artikel: 'artikelen',
  boek:    'boeken',
  podcast: 'podcasts',
  muziek:  'muziek',
}

const TYPE_ICON: Record<BronType, unknown> = {
  app:     Smartphone,
  website: Globe,
  video:   Play,
  artikel: FileText,
  boek:    BookOpen,
  podcast: Mic,
  muziek:  Music,
}

const LINK_LABEL: Record<BronType, string> = {
  app:     'bekijk',
  video:   'bekijk',
  artikel: 'lees',
  website: 'bezoek',
  podcast: 'beluister',
  muziek:  'beluister',
  boek:    'open',
}

const VOLGORDE: BronType[] = ['app', 'website', 'video', 'artikel', 'boek', 'podcast', 'muziek']

const categorieën = computed(() =>
  VOLGORDE
    .map(type => ({ type, label: LABELS[type], items: BRONNEN.filter(b => b.type === type) }))
    .filter(c => c.items.length > 0)
)
</script>

<template>
  <div>
    <h1 class="g-title">inspiratie</h1>

    <section v-for="cat in categorieën" :key="cat.type" class="mb-8">
      <div class="flex items-center gap-2 g-heading">
        <component :is="TYPE_ICON[cat.type]" :size="12" :stroke-width="2" />
        {{ cat.label }}
      </div>

      <div class="border border-black dark:border-stone-600 rounded overflow-hidden">
        <div
          v-for="bron in cat.items"
          :key="bron.id"
          class="flex items-start justify-between gap-4 px-3 py-3 border-t border-stone-200 dark:border-stone-700 first:border-t-0"
        >
          <div class="min-w-0">
            <p class="g-body font-bold">{{ bron.titel }}</p>
            <p v-if="bron.auteur" class="g-meta">{{ bron.auteur }}</p>
            <p v-if="bron.isbn" class="g-meta">{{ bron.isbn }}</p>
          </div>

          <a
            v-if="bron.url"
            :href="bron.url"
            target="_blank"
            rel="noopener noreferrer"
            class="g-link flex items-center gap-1 shrink-0 mt-0.5"
          >
            {{ LINK_LABEL[bron.type] }}
            <ExternalLink :size="10" />
          </a>
        </div>
      </div>
    </section>

    <p v-if="BRONNEN.length === 0" class="g-meta">nog niets toegevoegd</p>
  </div>
</template>
