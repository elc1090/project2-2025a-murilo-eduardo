<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Minhas Rotinas</h1>

    <div v-if="loading" class="text-center my-8">
      <q-spinner color="primary" size="50px" />
    </div>

    <div v-else>
      <div
        v-for="routine in routines"
        :key="routine.id"
        class="p-4 border rounded-lg shadow hover:shadow-md transition mb-4"
      >
        <h2 class="text-lg font-semibold">{{ routine.name }}</h2>
        <p class="text-sm text-gray-500 mb-2">
          {{ routine.description || "Sem descrição" }}
        </p>

        <q-btn
          color="primary"
          label="Ver Estrutura"
          @click="selectRoutine(routine)"
        />
      </div>
    </div>

    <div v-if="selectedRoutine" class="mt-6">
      <h2 class="text-xl font-bold mb-4">
        Estrutura da Rotina: {{ selectedRoutine.name }}
      </h2>

      <div
        v-for="day in selectedRoutine.days"
        :key="day.id"
        class="p-4 mb-4 border rounded-lg bg-gray-100"
      >
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold mb-2">
            {{ `${day.id} - ${day.name}` }}
          </h3>
          <q-btn
            :color="selectedDayId == day.id ? 'primary' : 'info'"
            :label="selectedDayId == day.id ? 'Selecionado' : 'Selecionar Dia'"
            size="sm"
            @click="selectDay(day)"
          />
        </div>

        <div v-if="day.slots?.length === 0" class="text-gray-500 mb-2">
          Nenhum exercício adicionado.
        </div>

        <ul v-else class="list-disc pl-5 mb-2">
          <li v-for="slot in day.slots" :key="slot.id">
            {{
              slot.entries.map((entry) => entry.exercise).join(" | ") ||
              "Desconhecido"
            }}
          </li>
        </ul>
      </div>

      <div v-if="selectedDayId" class="mt-8">
        <h3 class="text-lg font-bold mb-4">
          Exercícios salvos para adicionar no dia selecionado:
        </h3>

        <div v-if="exerciseStorage.data.length === 0" class="text-gray-500">
          Nenhum exercício salvo no momento.
          <br />
          <q-btn color="accent" label="Ir para Exercícios" to="/treinos" />
        </div>
        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          <div
            v-for="exercise in exerciseStorage.data"
            :key="exercise.id"
            class="border p-3 rounded shadow-sm flex flex-col justify-between"
          >
            <div>
              <div class="font-semibold">
                {{ `${exercise.id} - ${exercise.name}` }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                Músculos: {{ exercise.muscles || "N/A" }}
              </div>
            </div>
            <img
              :src="exercise.image || 'https://placehold.co/400'"
              alt="Exercise Image"
              class="h-24 object-contain my-2"
            />
            <q-btn
              color="positive"
              label="Adicionar ao Dia"
              @click="addExerciseToSelectedDay(exercise)"
              size="sm"
              class="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { Notify } from "quasar";
import {
  getRoutines,
  getRoutineStructure,
  createRoutineSlot,
  createRoutineSlotEntry,
} from "src/services/WgerService";
import { useExerciseStorage } from "src/stores/exerciseStorage";

const routines = ref([]);
const loading = ref(false);
const exerciseStorage = useExerciseStorage();

const selectedRoutine = ref(null);
const selectedDayId = ref(null);

const loadRoutines = async () => {
  loading.value = true;
  try {
    const { data } = await getRoutines();
    routines.value = data.results;
  } catch (error) {
    console.error("Erro ao carregar rotinas:", error);
  } finally {
    loading.value = false;
  }
};

const selectRoutine = async (routine) => {
  try {
    const { data } = await getRoutineStructure(routine.id);
    selectedRoutine.value = data;
  } catch (error) {
    console.error("Erro ao buscar estrutura da rotina:", error);
  }
};

const selectDay = (day) => {
  selectedDayId.value = day.id;
};

const addExerciseToSelectedDay = async (exercise) => {
  if (!selectedDayId.value) {
    Notify.create({
      type: "warning",
      message: "Selecione um dia primeiro.",
    });
    return;
  }

  try {
    const slotPayload = {
      day: selectedDayId.value,
      order: 2147483647,
      comment: "", // opcional
      config: "", // opcional
    };

    const { data: slotData } = await createRoutineSlot(slotPayload);

    const slotEntryPayload = {
      slot: slotData.id, // id do slot recém criado
      exercise: exercise.id,
      type: "normal", // ou "superset", "dropset"
      repetition_unit: 1, // ID da unidade de repetição (ex: 1 = repetições)
      repetition_rounding: "1", // Ex: "1" para arredondamento
      weight_unit: 1, // ID da unidade de peso (ex: 1 = kg)
      weight_rounding: "0.5", // Ex: "0.5" para arredondamento
      order: 2147483647,
      comment: "", // opcional
      config: "", // opcional
    };

    await createRoutineSlotEntry(slotEntryPayload);

    Notify.create({
      type: "positive",
      message: "Exercício adicionado com sucesso!",
    });

    await selectRoutine(selectedRoutine.value);
  } catch (error) {
    console.error("Erro ao adicionar exercício no dia:", error);
    Notify.create({
      type: "negative",
      message: "Erro ao adicionar exercício!",
    });
  }
};

onMounted(() => {
  loadRoutines();
});
</script>
