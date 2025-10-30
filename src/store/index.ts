import { defineStore } from "pinia";

const stroe = defineStore("counterStore", {
    state: () => ({
        userId: 0,
    }),

    actions: {
        EditUserId(val: number) {
            this.userId = val;
        },
    },

    persist: true,
});

export default stroe;

