<script setup lang="ts">
useSeoMeta({
  title: 'Gelukt — Privacy',
  description: 'Gelukt slaat geen enkele data op buiten jouw toestel. Geen server, geen database, geen account.',
  ogTitle: 'Privacy — Gelukt',
  ogDescription: 'Hoe Gelukt omgaat met jouw data: volledig lokaal, volledig privé.',
  ogUrl: 'https://gelukt.be/privacy',
})
</script>

<template>
  <div>
    <div class="text-xs uppercase tracking-widest mb-6">privacy</div>

    <div class="text-sm space-y-4 leading-relaxed">
      <p>Gelukt slaat geen enkele data op buiten jouw toestel.</p>

      <p>
        Er is geen server.<br />
        Er is geen database.<br />
        Er zijn geen accounts.<br />
        Er is niemand die jouw data kan zien — ook wij niet.
      </p>

      <p>
        Alles wat je invoert, staat in de lokale opslag (localStorage) van jouw browser.
        Als je de browserdata wist, is het weg.
        Wil je data overzetten naar een ander toestel? Gebruik de exportfunctie op de statspagina.
      </p>

      <p>
        Er worden geen cookies geplaatst.<br />
        Er is geen analytics.<br />
        Er zijn geen externe scripts.
      </p>

      <div class="border-t border-black pt-4 mt-6">
        <p class="text-xs text-stone-500">
          Verantwoordelijke voor de verwerking:<br />
          Luk Ramon<br />
          gelukt.be<br />
          contact: [e-mailadres toe te voegen]
        </p>
      </div>
    </div>
  </div>
</template>
