'use strict';

import Vue from "vue";
import Vuex from "vuex";
import todos from "./modules/todos";
import {ITodosState} from "../interface/index";

Vue.use(Vuex);

export interface IRootState {
    todos: ITodosState;
}

export const store: Vuex.Store<IRootState> = new Vuex.Store({
    modules: {
        todos
    }
});