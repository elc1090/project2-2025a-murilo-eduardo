<template>
  <q-layout view="hHh lpR fFf">
    <MainSidebar />

    <q-header elevated class="shadow">
      <q-toolbar class="px-4 lg:hidden">
        <q-btn flat dense round icon="menu" @click="toggleDrawer" />
        <q-toolbar-title class="lg:hidden">
          <img src="assets/fitmind-logo.png" class="cursor-pointer" />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import MainSidebar from "components/MainSidebar.vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const drawer = ref(true);
const route = useRoute();

function toggleDrawer() {
  drawer.value = !drawer.value;
}

const pageTitle = computed(() => {
  const titles = {
    "/dashboard": "Dashboard",
    "/treinos": "Treinos",
    "/exemplos": "Exemplos",
    "/videos": "Vídeos",
    "/montar-treino": "Montar Treino",
    "/nutricao": "Nutrição",
    "/perfil": "Perfil",
  };
  return titles[route.path] || "FitMind";
});
</script>
