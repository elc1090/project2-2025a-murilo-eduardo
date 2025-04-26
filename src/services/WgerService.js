import axiosService from "src/services/interceptors/AxiosService";

export async function getData(type, params) {
  return axiosService.get(`/${type}`, { params: { params } });
}

export async function getDetails(type, id, params) {
  return axiosService.get(`/${type}/${id}/`, { params: { params } });
}
