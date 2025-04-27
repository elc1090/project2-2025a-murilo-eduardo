import axiosService from "src/services/interceptors/AxiosService";

export async function getData(type, params) {
  return axiosService.get(`/${type}`, { params: { params } });
}

export async function getDetails(type, id, params) {
  return axiosService.get(`/${type}/${id}/`, { params: { params } });
}

export async function getRoutines() {
  const routines = await axiosService.get("/routine/");
  return routines.data.results;
}

export async function getDays(routine) {
  let days = await axiosService.get("/day/");
  return days.data.results.filter((day) => day.routine === routine);
}

export async function getSlots(day) {
  let slots = await axiosService.get("/slot/");
  console.log(slots.data.results);
  return slots.data.results.filter((slot) => slot.day == day);
}

export async function getSlotEntries(slot) {
  let slotEntries = await axiosService.get("/slot-entry/");
  return slotEntries.data.results.filter((slotEntry) => slotEntry.slot == slot);
}

export async function createRoutine(name) {
  const body = {
    name: name,
    // description: "string",
    start: "2025-01-01",
    end: "2025-12-31",
    // fit_in_week: true,
    // is_template: true,
    // is_public: true,
  };

  let response = await axiosService.post("/routine/", body);
  let routine = response.data;

  const weekDays = [
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
    "Domingo",
  ];

  weekDays.forEach(async (weekDay) => {
    await createDay(routine.id, weekDay);
  });

  return routine;
}

export async function createDay(routine, name) {
  const body = {
    routine: routine,
    // "order": 2147483647,
    name: name,
    // "description": "string",
    // "is_rest": true,
    // "need_logs_to_advance": true,
    // "type": "custom",
    // "config": "string"
  };

  let response = await axiosService.post("/day/", body);
  let day = response.data;

  await createSlot(day.id);

  return day;
}

export async function createSlot(day) {
  const body = {
    day: day,
    // order: 2147483647,
    // comment: "string",
    // config: "string",
  };

  let response = await axiosService.post("/slot/", body);

  return response.data;
}

export async function createSlotEntry(slot, exercise) {
  const body = {
    slot: slot,
    exercise: exercise,
    // type: "normal",
    // repetition_unit: 0,
    // repetition_rounding: "54.06",
    // weight_unit: 0,
    // weight_rounding: "-91",
    order: 2147483647, // If order is not specified, the API doesn't work.
    // comment: "string",
    // config: "string",
  };

  let response = await axiosService.post("/slot-entry/", body);
  return response.data;
}

export async function deleteRoutines() {
  let routines = await getRoutines();

  routines.map((routine) => {
    axiosService.delete(`/routine/${routine.id}`);
  });
}
