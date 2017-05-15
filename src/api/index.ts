import request from "../utils/request";
import {IRawTodoItem, ITodoItem} from "../interface/index";
import * as qs from "qs";

function parseToRawItem(todo: ITodoItem): IRawTodoItem {
    return Object.assign({}, todo, {
        date: todo.date.format("YYYY-MM-DD HH:mm")
    });
}


export function fetchTodos() {
    return request('/todos', {
        method: 'GET'
    });
}

export function updateTodo(updatedTodoItem: ITodoItem) {
    return request('/todos?type=update', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }),
        body: qs.stringify(parseToRawItem(updatedTodoItem))
    })
}


export function addTodo(newTodoItem: ITodoItem) {
    return request('/todos?type=add', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }),
        body: qs.stringify(parseToRawItem(newTodoItem))
    });
}

export function deleteTodo(deleteTid: string) {
    return request(`/todos?${qs.stringify({tid: deleteTid})}`, {
        method: 'DELETE'
    });
}