import { defineStore } from "pinia";

const store = defineStore("counterStore", {
    state: () => ({
        userId: 0,
    }),

    actions: {
        EditUserId(val: number) {
            this.userId = val;
        },
    },

    persist: {
        key: "site",
        storage: localStorage,
        pick: ["userId"],
    },
});

export default store;

