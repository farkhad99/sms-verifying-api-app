import Vue from "vue";

export const store = Vue.observable({
  username: 'name' 
});

export const mutations = {
  setUsername(login) {
    store.username = login;
  }
};