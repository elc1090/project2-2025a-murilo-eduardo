import { defineStore } from "pinia";

const defaultData = [];

export const getWishesStorage = () => {
  const wishesString = localStorage.getItem("nuuvem-wishes");

  if (!wishesString) {
    return defaultData;
  }

  try {
    return JSON.parse(wishesString);
  } catch (error) {
    console.error("Erro ao parsear nuuvem-wishes do localStorage:", error);
    return defaultData;
  }
};

export const useWishesStore = defineStore("nuuvem-wishes", {
  state: () => ({ wishesData: getWishesStorage() }),
  getters: {
    storeWishesDataGetter(state) {
      return state.wishesData;
    },
  },
  actions: {
    storageWishesSave(wishes) {
      this.wishesData = wishes;
      localStorage.setItem("nuuvem-wishes", JSON.stringify(this.wishesData));
    },
    storageWishesRemove() {
      this.wishesData = defaultData;
      localStorage.removeItem("nuuvem-wishes");
    },
  },
});
