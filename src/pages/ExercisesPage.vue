<template>
  <div class="flex flex-col items-center justify-center gap-3 p-4 w-full">
    <div class="flex flex-nowrap items-center justify-between w-full">
      <h1 class="text-2xl font-bold mb-4">Escolher Exercícios</h1>
      <q-btn
        label="Limpar Store"
        color="negative"
        icon="bi-trash"
        @click="() => exerciseStorage.remove()"
        push
        dense
      />
    </div>
    <q-separator class="w-full" />
    <div class="grid grid-cols-3 gap-3 w-full">
      <q-select
        class="w-full"
        v-model="filter.category"
        :options="optCategory"
        outlined
        @update:model-value="() => loadExercises(true)"
      />
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="exercise in exercises"
        :key="exercise.id"
        class="p-4 border rounded-lg shadow hover:shadow-md transition"
      >
        <div class="flex flex-col items-center text-center">
          <q-img
            :src="exercise.image || 'https://placehold.co/400'"
            alt="exercicio"
            class="h-40 object-contain mb-2"
          />
          <h2 class="text-lg font-semibold">{{ exercise.name }}</h2>
          <p class="text-sm text-gray-500 mb-2">
            Músculos: {{ exercise.muscles }}
          </p>
          <q-btn
            :color="isSaved(exercise.id) ? 'negative' : 'positive'"
            :label="isSaved(exercise.id) ? 'Remover' : 'Adicionar'"
            @click="toggleExercise(exercise)"
          />
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center my-8">
      <q-spinner color="primary" size="50px" />
    </div>

    <div v-if="isEnd" class="text-center my-4 text-gray-500">
      Não há mais exercícios para carregar.
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  getExercises,
  getExerciseInfo,
  getCategory,
} from "src/services/WgerService";
import { useExerciseStorage } from "src/stores/exerciseStorage";

const exercises = ref([]);
const optCategory = ref([]);
const filter = ref({
  category: "",
});
const loading = ref(false);
const exerciseStorage = useExerciseStorage();
const offset = ref(0);
const isEnd = ref(false);

const isSaved = (id) => exerciseStorage.data.some((e) => e.id === id);

const toggleExercise = (exercise) => {
  const index = exerciseStorage.data.findIndex((e) => e.id === exercise.id);
  if (index === -1) {
    exerciseStorage.save([...exerciseStorage.data, exercise]);
  } else {
    const updated = [...exerciseStorage.data];
    updated.splice(index, 1);
    exerciseStorage.save(updated);
  }
};

const fetchDetails = async (id) => {
  try {
    const response = await getExerciseInfo(id);
    return response.data;
  } catch (err) {
    console.error("Erro ao buscar detalhes:", err);
    return null;
  }
};

const loadExercises = async (forceOffset = false) => {
  if (forceOffset) {
    exercises.value = [];
    offset.value = 0;
  }
  if (loading.value || isEnd.value) return;
  loading.value = true;
  try {
    const { data } = await getExercises(offset.value, {
      category: filter.value.category && filter.value.category.value,
    });
    if (data.results.length === 0) {
      isEnd.value = true;
    } else {
      const detailed = await Promise.all(
        data.results.map(async (ex) => {
          const info = await fetchDetails(ex.id);
          return {
            id: ex.id,
            name: ex.name,
            image: info?.images?.[0]?.image || null,
            muscles:
              info?.muscles?.map((m) => m.name).join(", ") || "Desconhecido",
          };
        })
      );
      exercises.value.push(...detailed);
      offset.value += 20;
    }
  } catch (error) {
    console.error("Erro ao carregar exercícios:", error);
  } finally {
    loading.value = false;
  }
};

const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadExercises();
  }
};

const loadCategory = async () => {
  try {
    const { data } = await getCategory();
    optCategory.value = data.results.map((cat) => {
      return { label: cat.name, value: cat.id };
    });
  } catch (error) {
    console.error("🚀 ~ loadCategory ~ error:", error);
  }
};

onMounted(() => {
  loadCategory();
  loadExercises();
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
