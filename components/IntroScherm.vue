<script setup lang="ts">
import { TEKSTEN } from "~/data/teksten";
const router = useRouter();

// useState zodat profiel.vue het ook kan aansturen zonder page reload
const tonen = useState("introTonen", () => false);
const stap = useState("introStap", () => 1);

onMounted(() => {
    if (!localStorage.getItem("gelukt-intro-gezien")) {
        stap.value = 1;
        tonen.value = true;
    }
});

function sluit() {
    localStorage.setItem("gelukt-intro-gezien", "true");
    tonen.value = false;
}

function stelIn() {
    sluit();
    router.push("/profiel?sectie=sync");
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="tonen"
            class="fixed inset-0 bg-paper dark:bg-black z-50 overflow-auto flex flex-col"
        >
            <div class="flex-1 flex items-center justify-center p-6">
                <div class="max-w-sm w-full">
                    <!-- Stap 1 -->
                    <template v-if="stap === 1">
                        <h1 class="g-title">gelukt</h1>

                        <p class="g-body mb-4">
                            Gelukt is jouw persoonlijke hulpmiddel om bewuster
                            om te gaan met de strijd tegen porno- en
                            masturbatieverslaving.
                        </p>

                        <p class="g-body mb-4">
                            Door je triggers nauwkeurig te loggen, leer je
                            patronen herkennen en begrijp je beter waarom je
                            terugvalt. Dit geeft je de tools om in de toekomst
                            sterker te staan. Gelukt helpt je om je doelen
                            scherp te houden en de focus te verleggen van het
                            verleden naar de toekomst (Filippenzen 3:13).
                        </p>

                        <p class="g-body mb-10">
                            Houd in gedachten: Gelukt is een middel, maar God is
                            de bron van herstel. Werk aan je relatie met Hem
                            door gebed, bijbellezen en volledige overgave. Leg
                            je strijd in Zijn hand en vertrouw op Zijn genade (1
                            Johannes 1:9).
                        </p>

                        <div class="flex items-center justify-between">
                            <button @click="stap = 2" class="g-btn-solid">
                                verder
                            </button>
                            <p class="g-meta">1 / 2</p>
                        </div>
                    </template>

                    <!-- Stap 2 -->
                    <template v-else>
                        <h1 class="g-title">jouw data</h1>

                        <p class="g-body mb-4">{{ TEKSTEN.privacy }}</p>

                        <p class="g-body mb-4">{{ TEKSTEN.syncUitleg }}</p>

                        <p class="g-meta mb-10">
                            {{ TEKSTEN.cloudVoorbeelden }}<br />
                            Je kan dit ook later instellen via profiel →
                            instellingen.
                        </p>

                        <div class="flex items-center justify-between">
                            <div class="flex gap-3">
                                <button @click="stelIn" class="g-btn-solid">
                                    stel nu in
                                </button>
                                <button @click="sluit" class="g-btn">
                                    sla over
                                </button>
                            </div>
                            <p class="g-meta">2 / 2</p>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </Teleport>
</template>
