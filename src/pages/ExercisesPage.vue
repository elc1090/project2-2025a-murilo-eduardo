<template>
  <div class="p-8">
    <q-select
      class="pb-4"
      color="blue-12"
      popup-content-class="text-black"
      filled
      v-model="selectedRoutine"
      :options="routines.map((routine) => routine.name)"
      label="Treino"
    />
    <q-select
      class="pb-4"
      color="blue-12"
      popup-content-class="text-black"
      filled
      v-model="selectedDay"
      :options="days.map((day) => day.name)"
      label="Dia"
    />
    <div class="pb-4">
      <q-btn
        label="Montar Treino"
        icon="edit"
        color="light-blue"
        @click="mount"
        no-caps
        push
      >
        <q-badge color="red" floating>{{ exerciseCount }}</q-badge>
      </q-btn>
      <span class="text-white text-2xl font-bold">{{ exerciseCount }}</span>
    </div>
    <q-btn
      label="Debug"
      icon="edit"
      color="negative"
      @click="
        async () => {
          await deleteRoutines();
          await createRoutine('Treino Teste');
        }
      "
      no-caps
      push
    ></q-btn>
  </div>
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
import { ref, watch, onMounted, computed } from "vue";
import {
  createRoutine,
  createSlotEntry,
  getRoutines,
  deleteRoutines,
  getSlots,
  getDays,
  getData,
  getDetails,
} from "src/services/WgerService";
import { useQuasar } from "quasar";
import { useExerciseStorage } from "src/stores/exerciseStorage";

const $q = useQuasar();
const exercises = ref([]);

const fetchExercises = async () => {
  $q.loading.show();
  try {
    const { data } = await getData("exerciseinfo");
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

// Exercise storage related
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

// Routine related
const selectedRoutine = ref(null);
const routines = ref([]);
const fetchRoutines = async () => {
  routines.value = await getRoutines();
};

// Day related
const selectedDay = ref(null);
const days = ref([]);
watch(selectedRoutine, async (routineName) => {
  if (routineName) {
    let routineIndex = routines.value.findIndex(
      (routine) => routineName == routine.name
    );
    let routine = routines.value[routineIndex];
    days.value = await getDays(routine.id);
  } else {
    days.value = [];
  }
});

const mount = async () => {
  let dayIndex = days.value.findIndex((day) => day.name == selectedDay.value);
  let day = days.value[dayIndex];

  let slots = await getSlots(day.id);

  // There should be one and only one slot.
  let slot = slots[0].id;

  exerciseStorage.data.forEach((exercise) => {
    createSlotEntry(slot, exercise);
  });

  exerciseStorage.save([]);
};

onMounted(() => {
  fetchExercises();
  fetchRoutines();
});
</script>
