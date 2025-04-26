<template>
  <q-drawer show-if-above v-model="drawer" side="left" bordered>
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="p-4 flex items-center justify-center border-b">
        <img src="assets/fitmind-logo.png" alt="Logo" class="h-12" />
      </div>

      <!-- Menu -->
      <q-list class="flex-1" padding>
        <q-item
          v-for="item in menuItems"
          :key="item.label"
          :clickable="hasAuthentication"
          :disable="!hasAuthentication"
          :to="item.route"
          class="rounded-lg hover:bg-primary-80 transition-all text-dark"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- Footer -->
      <div class="p-4 border-t">
        <q-btn
          flat
          dense
          icon="logout"
          label="Sair"
          class="text-red-600 hover:text-red-800"
          @click="logout"
        />
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/auth";

const drawer = ref(true);
const $q = useQuasar();
const router = useRouter();
const auth = useAuthStore();

const hasAuthentication = computed(() => {
  return !!auth?.authData?.token;
});

const menuItems = [
  { label: "Dashboard", icon: "dashboard", route: "/" },
  { label: "Treinos", icon: "fitness_center", route: "/treinos" },
  // { label: "Exemplos", icon: "visibility", route: "/exemplos" },
  // { label: "Vídeos", icon: "ondemand_video", route: "/videos" },
  { label: "Montar Treino", icon: "edit", route: "/montar-treino" },
  // { label: "Nutrição", icon: "restaurant_menu", route: "/nutricao" },
  // { label: "Perfil", icon: "account_circle", route: "/perfil" },
];

const logout = () => {
  $q.notify({
    type: "positive",
    message: "Você saiu com sucesso!",
  });
  router.push("/login");
};
</script>
