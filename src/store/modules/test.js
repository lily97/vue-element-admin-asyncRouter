const state = {
    age: 18,
};
const mutations = {
    SET_AGE(state, age) {
        console.log(state.age, age);
        state.age = age;
    }
}

const actions = {
    setAge({ commit }) {
        commit('SET_AGE')
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}