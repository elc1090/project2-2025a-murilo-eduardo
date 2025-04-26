<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-8">
    <q-list class="flex items-center justify-center gap-3 w-full">
      <q-item
        class="bg-primary rounded-xl q-pa-md q-mb-md"
        v-for="(item, idx) in day"
        :key="idx"
      >
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <q-item-label caption>{{ item.description }}</q-item-label>
          <div v-if="item.details">
            <pre>
              {{ item.details }}
            </pre>
          </div>
        </q-item-section>
        <q-item-section side>
          <q-btn
            label="Detalhes"
            icon="bi-plus-circle-dotted"
            color="positive"
            @click="() => moreDetails(item.id)"
            no-caps
            push
          />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { getData, getDetails } from "src/services/WgerService";
import { useQuasar } from "quasar";

const $q = useQuasar();
const day = ref([]);

const fetchDay = async () => {
  try {
    const { data } = await getData("day");
    console.log("🚀 ~ fetchDay ~ data:", data);
    if (data) day.value = data.results;
  } catch (error) {
    console.log("🚀 ~ fetchDay ~ error:", error);
    $q.notify({
      color: "negative",
      message: error.message || "Error fetching day",
      icon: "error",
    });
  }
};

const moreDetails = async (id) => {
  try {
    const { data } = await getDetails("day", id);
    console.log("🚀 ~ fetchDay ~ data:", data);
    if (data) {
      const item = day.value.find((item) => item.id === id);
      if (item) {
        item.details = data.details;
      }
    }
  } catch (error) {
    console.log("🚀 ~ fetchDay ~ error:", error);
    $q.notify({
      color: "negative",
      message: error.message || "Error fetching day",
      icon: "error",
    });
  }
};

onMounted(() => {
  fetchDay();
});
</script>
