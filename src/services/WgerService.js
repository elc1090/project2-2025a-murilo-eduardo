import axiosService from "src/services/interceptors/AxiosService";

export async function getUserRepo(user) {
  return axiosService.get(`/users/${user}/repos`);
}

export async function getRepoCommits(user, repo) {
  return axiosService.get(`/repos/${user}/${repo}/commits`);
}
