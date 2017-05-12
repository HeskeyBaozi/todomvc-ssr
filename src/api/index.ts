import {ITodoItem} from "../interface/index";
import moment = require("moment");

export const fetchTodos = async function(): Promise<ITodoItem[]> {
    return new Promise<ITodoItem[]>((resolve, reject) => {
        setTimeout(() => {
            resolve([
                {
                    isCompleted: false,
                    title: 'Hello001',
                    description: 'Description001',
                    date: moment("1997-10-14 18:18", "YYYY-MM-DD HH:mm"),
                    tid: '001'
                },
                {
                    isCompleted: false,
                    title: 'Hello002',
                    description: 'Description002',
                    date: moment(),
                    tid: '002'
                },
                {
                    isCompleted: true,
                    title: 'Hello003',
                    description: 'Description003',
                    date: moment(),
                    tid: '003'
                },
            ]);
        }, 500);
    });
};