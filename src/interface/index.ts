'use strict';

import {Moment} from "moment";

export interface ITodoItem {
    tid: string;
    title: string;
    description: string;
    isCompleted: boolean;
    date: Moment;
}

export enum FilterState {
    all, active, completed
}

export interface ITodosState {
    todos: Array<ITodoItem>;
    currentTodo: ITodoItem;
    loading: boolean;
}