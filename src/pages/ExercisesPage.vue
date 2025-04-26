<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-8">
    <q-list>
      <q-item
        class="bg-primary rounded-xl q-pa-md q-mb-md"
        v-for="(item, idx) in exercises"
        :key="idx"
      >
        <q-item-section class="text-white">
          <q-item-label>
            {{ item.category?.name || "-" }}
          </q-item-label>
          <q-item-label class="text-white flex flex-col" caption>
            <span>
              <b>Equipamentos:</b>
              {{ item.equipment.map((e) => e.name).join(" | ") || "-" }}
            </span>
            <span v-if="item.muscles">
              <b>Musculos:</b>
              {{ item.muscles.map((m) => m.name).join(" | ") || "-" }}
            </span>
            <div v-for="desc in item.translations" :key="desc.id">
              <span>
                {{ desc.author_history.join(" | ") }}
              </span>
              <span>
                {{ desc.description }}
              </span>
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            v-if="!exerciseStorage.data.includes(item.id)"
            label="Add Treino"
            icon="bi-plus-circle-dotted"
            color="positive"
            @click="() => addExercise(item.id)"
            no-caps
            push
          />
          <q-btn
            v-else
            label="Remove Treino"
            icon="bi-dash-circle"
            color="negative"
            @click="() => removeExercise(item.id)"
            no-caps
            push
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { getData, getDetails } from "src/services/WgerService";
import { useQuasar } from "quasar";
import { useExerciseStorage } from "src/stores/exerciseStorage";

const $q = useQuasar();
const exercises = ref([]);

const fetchExercises = async () => {
  $q.loading.show();
  try {
    const { data } = await getData("exerciseinfo");
    console.log("🚀 ~ fetchExercises ~ data:", data);
    if (data) exercises.value = data.results;
  } catch (error) {
    console.log("🚀 ~ fetchExercises ~ error:", error);
    $q.notify({
      color: "negative",
      message: error.message || "Error fetching exercises",
      icon: "error",
    });
  } finally {
    $q.loading.hide();
  }
};

const exerciseStorage = useExerciseStorage();

const addExercise = (id) => {
  exerciseStorage.save([...exerciseStorage.data, id]);
};

const removeExercise = (id) => {
  let filtered = exerciseStorage.data.filter((exerciseId) => exerciseId != id);
  exerciseStorage.save(filtered);
};

const exerciseCount = computed(() => {
  return exerciseStorage.data.length;
});

onMounted(() => {
  fetchExercises();
});
</script>
