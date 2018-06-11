'use strict';
import {ITodoItem, ITodosState, IRawTodoItem} from "../../interface";
import {ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {IRootState} from "../";
import {addTodo, deleteTodo, fetchTodos, updateTodo} from "../../api";
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
        let rawItems: IRawTodoItem[] = [];
        let loadingTodos: ITodoItem[] = [
            {
                tid: 'demo',
                title: 'demo',
                description: 'demo',
                isCompleted: false,
                date: moment()
            }
        ];
        try {
            rawItems = await fetchTodos();
            console.log(rawItems);
            loadingTodos = <ITodoItem[]>rawItems.map((rawItem: IRawTodoItem) => {
                return <ITodoItem>{
                    tid: rawItem.tid,
                    title: rawItem.title,
                    description: rawItem.description,
                    isCompleted: rawItem.isCompleted,
                    date: moment(rawItem.date, "YYYY-MM-DD HH:mm")
                };
            });
        } catch (error) {
            console.log('get error: ', error);
        }
        commit('loadingTodos', loadingTodos);
    },
    async addNewTodosAsync({commit, state}): Promise<void> {
        const newItem = Object.assign({}, state.currentTodo);
        if (!newItem.title.trim())
            return;
        newItem.tid = newItem.title + moment().milliseconds();
        // await addTodo(newItem);
        commit('pushBackTodos', newItem);
        commit('clearCurrentItem');
    },
    async setAllCompletedAsync({commit, state}, completedValue: boolean): Promise<void> {
        commit('saveTodoCompletedValue', completedValue);
        for (let todo of state.todos) {
            // await updateTodo(todo);
        }
    },
    async updateTodosAsync({commit, state}, updatedTodoItem: ITodoItem): Promise<void> {
        if (!updatedTodoItem.title.trim()) {
            return;
        }
        // await updateTodo(updatedTodoItem);
        commit('updateOldTodoItem', updatedTodoItem);
    },
    async removeTodosAsync({commit, state}, removedTodo: ITodoItem): Promise<void> {
        if (state.currentTodo.tid === removedTodo.tid) {
            commit('clearCurrentItem');
        }
        // await deleteTodo(removedTodo.tid);
        commit('spliceTodos', removedTodo.tid);
    },
    async setCurrentTodoAsync({commit, state}, selectedTodo: ITodoItem): Promise<void> {
        if (selectedTodo.tid === state.currentTodo.tid) {
            return;
        } else {
            commit('setCurrentTodoItem', selectedTodo);
        }

    },
    async removeCompletedTodoAsync({commit, state}, filter: (todos: ITodoItem[]) => ITodoItem[]): Promise<void> {
        for (let todo of state.todos) {
            if (todo.isCompleted) {
                // await deleteTodo(todo.tid);
            }
        }
        const filteredTodos: ITodoItem[] = filter(state.todos);
        commit('setTodos', filteredTodos);
        const index: number = state.todos.findIndex(todo => todo.tid === state.currentTodo.tid);
        if (index === -1) {
            commit('clearCurrentItem');
        }
    }
};

const mutations: MutationTree<ITodosState> = {
    loadingTodos(state: ITodosState, todos: ITodoItem[]): void {
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
    },
    saveTodoCompletedValue(state: ITodosState, completedValue: boolean): void {
        state.todos.forEach(todo => {
            todo.isCompleted = completedValue;
        });
    },
    updateOldTodoItem(state: ITodosState, newTodoItem: ITodoItem): void {
        const index: number = state.todos.findIndex(todo => todo.tid === newTodoItem.tid);
        state.todos.splice(index, 1, newTodoItem);
    },
    spliceTodos(state: ITodosState, tid: string): void {
        const index: number = state.todos.findIndex(todo => todo.tid === tid);
        state.todos.splice(index, 1);
    },
    setCurrentTodoItem(state: ITodosState, selectedTodoItem: ITodoItem): void {
        state.currentTodo = selectedTodoItem;
    },
    setTodos(state: ITodosState, newTodos: ITodoItem[]): void {
        state.todos = newTodos;
    }
};

const getters: GetterTree<ITodosState, IRootState> = {};

export default {
    state,
    actions,
    getters,
    mutations
} as Module<ITodosState, IRootState>;
