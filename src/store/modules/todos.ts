'use strict';
import {ITodoItem, ITodosState} from "../../interface";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {IRootState} from "../";
import {fetchTodos} from "../../api";
import moment = require("moment");


const state: ITodosState = {
    todos: [],
    currentTodo: {
        isCompleted: false,
        title: '',
        description: '',
        date: moment(),
        tid: null
    },
    loading: true
};

const actions: ActionTree<ITodosState, IRootState> = {
    async initializeTodosAsync({commit}): Promise<void> {
        commit('saveTodos', await fetchTodos());
    },
    async addNewTodosAsync({commit, state}): Promise<void> {
        const newItem = Object.assign({}, state.currentTodo);
        if (!newItem.title.trim())
            return;
        newItem.tid = newItem.title + moment().milliseconds();
        commit('pushBackTodos', newItem);
        commit('clearCurrentItem');
    }
};

const mutations: MutationTree<ITodosState> = {
    saveTodos(state: ITodosState, todos: ITodoItem[]): void {
        state.todos = todos;
        state.loading = false;
    },
    pushBackTodos(state: ITodosState, item: ITodoItem): void {
        state.todos.push(item);
    },
    clearCurrentItem(state: ITodosState): void {
        Object.assign(state.currentTodo, {
            isCompleted: false,
            title: '',
            description: '',
            date: moment(),
            tid: null
        });
    }
};

const getters: GetterTree<ITodosState, IRootState> = {};

export default {
    state,
    actions,
    getters,
    mutations
} as Module<ITodosState, IRootState>;