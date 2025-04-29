import axiosService from "src/services/interceptors/AxiosService";

export const getExercises = (offset = 0) =>
  axiosService.get(`/exercise/?language=2&limit=20&offset=${offset}`);

export const getExerciseInfo = (id) => axiosService.get(`/exerciseinfo/${id}/`);

export const getRoutines = () =>
  axiosService.get("/routine/", {
    params: {
      is_public: false,
      is_template: false,
    },
  });

export const getRoutineDetail = (id) => axiosService.get(`/routine/${id}/`);

export const getRoutineStructure = (id) =>
  axiosService.get(`/routine/${id}/structure/`);

export const createRoutineSlot = (payload) =>
  axiosService.post("/slot/", payload);

export const createRoutineSlotEntry = (payload) =>
  axiosService.post("/slot-entry/", payload);
