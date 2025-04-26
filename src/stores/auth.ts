import { defineStore } from "pinia";

const defaultData = {
  token: process.env.VITE_WGER_TOKEN || null,
};

export const getAuthStorage = () => {
  const authString = localStorage.getItem("fitmind-auth");

  if (!authString) {
    return defaultData;
  }

  try {
    return JSON.parse(authString);
  } catch (error) {
    console.error("Erro ao parsear fitmind-auth do localStorage:", error);
    return defaultData;
  }
};

export const useAuthStore = defineStore("fitmind-auth", {
  state: () => ({ authData: getAuthStorage() }),
  getters: {
    storeAuthDataGetter(state) {
      return state.authData;
    },
  },
  actions: {
    storageAuthSave(auth) {
      this.authData = auth;
      localStorage.setItem("fitmind-auth", JSON.stringify(this.authData));
    },
    storageAuthRemove() {
      this.authData = defaultData;
      localStorage.removeItem("fitmind-auth");
    },
  },
});
