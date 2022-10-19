import { defineStore } from "../lib/index";

export const useStore = defineStore({
  state: {
    count: 1,
    name: "savage",
  },
  actions: {
    // 会自动传入 state
    increment(state, payload) {
      state.count += 1;
      // console.debug(state, payload);
    },
    changeNmae() {},
  },
});

