<template>
    <mu-paper class="main-container" :zDepth="2">
        <!-- Top Title -->
        <mu-appbar title="Todos">
            <mu-icon-button icon="menu" slot="left"></mu-icon-button>
        </mu-appbar>

        <!-- Main -->
        <mu-flexbox class="main-part" align="flex-start">
            <!-- Left Part -->
            <mu-flexbox-item class="one-part">
                <template v-if="loading">
                    <div class="center">
                        <mu-circular-progress class="loading-ring" :strokeWidth="5" :size="90"></mu-circular-progress>
                    </div>
                </template>
                <template v-else>
                    <mu-list v-show="todos.length">
                        <mu-sub-header>
                            <mu-checkbox :value="allDone" @change="toggleAll"></mu-checkbox>
                        </mu-sub-header>
                        <transition-group name="list" tag="div" mode="out-in">
                            <mu-list-item v-for="todo in filteredTodos"
                                          :title="todo.title"
                                          :key="todo.tid"
                                          :class="{'item-selected':todo.tid === currentTodo.tid && isEditing, deleted: todo.isCompleted}"
                                          @click.stop="itemClick(todo)">
                                <mu-checkbox v-model="todo.isCompleted" slot="left"></mu-checkbox>
                                <mu-icon-button icon="delete" slot="right"
                                                @click.stop="removeTodo(todo, $event)"></mu-icon-button>
                            </mu-list-item>
                        </transition-group>
                    </mu-list>
                    <p class="item-count"><strong>{{ remaining }}</strong> item{{remaining < 2 ? '' : 's'}} left...</p>
                    <p v-show="todos.length" class="radio-group">
                        <mu-radio v-model="filterState" name="filter" nativeValue="all" label="All"></mu-radio>
                        <mu-radio v-model="filterState" name="filter" nativeValue="active" label="Active"></mu-radio>
                        <mu-radio v-model="filterState" name="filter" nativeValue="completed"
                                  label="Completed"></mu-radio>
                    </p>
                    <mu-raised-button v-show="todos.length"
                                      @click.stop="removeCompleted()"
                                      fullWidth>Clear Completed
                    </mu-raised-button>
                </template>
            </mu-flexbox-item>

            <!-- Right Part -->
            <mu-flexbox-item class="one-part">
                <h2>Detail</h2>
                <mu-flexbox class="title-input">
                    <mu-flexbox-item>
                        <mu-flexbox justify="space-between">
                            <mu-flexbox-item :grow="5">
                                <mu-text-field id="title-entry"
                                               hintText="Title..."
                                               fullWidth
                                               v-model="currentTodo.title"></mu-text-field>
                            </mu-flexbox-item>
                            <mu-flexbox-item :grow="3">
                                <mu-date-picker id="date-entry"
                                                mode="landscape"
                                                fullWidth
                                                okLabel="OK"
                                                cancelLabel="cancel"
                                                format="YYYY-MM-DD"
                                                v-model="itemDate"
                                                hintText="Date"></mu-date-picker>
                            </mu-flexbox-item>
                            <mu-flexbox-item :grow="2">
                                <mu-time-picker id="time-entry"
                                                mode="landscape"
                                                format="24hr"
                                                fullWidth
                                                okLabel="OK"
                                                cancelLabel="cancel"
                                                :value="itemTime"
                                                hintText="Time"></mu-time-picker>
                            </mu-flexbox-item>
                        </mu-flexbox>
                    </mu-flexbox-item>
                </mu-flexbox>
                <div class="description-input">
                    <mu-text-field id="des-entry"
                                   hintText="Description..."
                                   multiLine
                                   :rows="3"
                                   :rowsMax="6"
                                   fullWidth
                                   v-model="currentTodo.description"></mu-text-field>
                </div>
                <mu-raised-button :label="isEditing ? 'update': 'add new'"
                                  class="submit-button"
                                  @click="isEditing ? updateTodo() : addNewTodosAsync()"
                                  fullWidth
                                  primary></mu-raised-button>
                <mu-raised-button v-show="currentTodo.title"
                                  @click.stop="clearDetail()"
                                  label="Clear"
                                  class="clear-button"
                                  fullWidth></mu-raised-button>
            </mu-flexbox-item>
        </mu-flexbox>
    </mu-paper>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import moment = require('moment');
    import {ITodoItem, FilterState} from '../interface';
    import {Action, State, Getter} from 'vuex-class';


    // helper
    const filters = {
        [FilterState.all]: (todos: Array<ITodoItem>) => todos,
        [FilterState.active]: (todos: Array<ITodoItem>) => todos.filter(todo => !todo.isCompleted),
        [FilterState.completed]: (todos: Array<ITodoItem>) => todos.filter(todo => todo.isCompleted)
    };

    @Component({
        name: 'hello'
    })
    export default class Hello extends Vue {
        // Vuex State
        @State(({todos}) => todos.todos)
        todos: Array<ITodoItem>;

        @State(({todos}) => todos.currentTodo)
        currentTodo: ITodoItem;

        @State(({todos}) => todos.loading)
        loading: boolean;

        // Local State
        visibility: FilterState = FilterState.all;

        editingTid: string = null;

        // Computed
        get filterState(): string {
            return FilterState[this.visibility];
        }

        set filterState(value: string) {
            this.visibility = FilterState[value];
        }

        get remaining(): number {
            return filters[FilterState.active](this.todos).length;
        };

        get isEditing(): boolean {
            return this.editingTid !== null;
        }

        get filteredTodos(): Array<ITodoItem> {
            return filters[this.visibility](this.todos);
        };

        get allDone(): boolean {
            return this.remaining === 0;
        }

        get itemDate(): string {
            return this.currentTodo.date.format('YYYY-MM-DD');
        }

        set itemDate(value: string) {
            const time: string = this.currentTodo.date.format('HH:mm');
            this.currentTodo.date = moment(`${value} ${time}`, 'YYYY-MM-DD HH:mm');
        }

        get itemTime(): string {
            return this.currentTodo.date.format('HH:mm');
        }

        set itemTime(value: string) {
            const date: string = this.currentTodo.date.format('YYYY-MM-DD');
            this.currentTodo.date = moment(`${date} ${value}`, 'YYYY-MM-DD HH:mm');
        }

        // lifecycle
        mounted() {
            this.initializeTodoAsync();
        }

        // method
        @Action('initializeTodosAsync')
        initializeTodoAsync;

        @Action('addNewTodosAsync')
        addNewTodosAsync;

        toggleAll(checked: boolean): void {
            this.todos.forEach(todo => {
                todo.isCompleted = checked;
            });
        }

        removeTodo(currentTodo: ITodoItem, e: Event): void {
            if (currentTodo.tid === this.currentTodo.tid) {
                this.editingTid = null;
            }
            const index: number = this.todos.findIndex(todo => todo.tid === currentTodo.tid);
            this.todos.splice(index, 1);
        }

        updateTodo(): void {
            if (!this.currentTodo.title.trim()) {
                return;
            }
            this.todos.forEach(todo => {
                if (todo.tid === this.currentTodo.tid) {
                    Object.assign(todo, this.currentTodo);
                }
            })
        }

        clearDetail(): void {
            Object.assign(this.currentTodo, {
                isCompleted: false,
                title: '',
                description: '',
                date: moment(),
                tid: null
            });
        }

        itemClick(todo: ITodoItem): void {
            if (this.isEditing) {
                this.editingTid = null;
                this.clearDetail();
            } else {
                this.editingTid = todo.tid;
                Object.assign(this.currentTodo, {}, todo);
            }
        }

        removeCompleted(): void {
            this.todos = filters[FilterState.active](this.todos);
            if (!this.remaining) {
                this.editingTid = null;
                this.clearDetail();
            }
        }
    }
</script>

<style scoped>
    .main-container {
        width: 80%;
        margin: 20px auto;
    }

    .main-part {
        padding: 10px 10px 30px 10px;
    }

    .one-part {
        padding: 0 5px;
    }

    .submit-button {
        margin-bottom: 10px;
    }

    .radio-group > * {
        margin-right: 10px;
    }

    .item-count, .radio-group {
        text-align: center;
    }

    .deleted {
        text-decoration-line: line-through;
        text-decoration-color: #ff5252;
    }

    .item-selected {
        background-color: rgba(74, 74, 79, 0.1);
    }

    .list-enter-active, .list-leave-active {
        transition: all .5s;
    }

    .list-enter, .list-leave-active {
        opacity: 0;
        transform: translateX(-50px);
    }

    .center {
        width: 100%;
        text-align: center;
    }

    .loading-ring {
        margin: 60px auto;
    }
</style>
