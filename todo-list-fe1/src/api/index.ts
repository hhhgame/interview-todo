import axios, {AxiosResponse} from "axios";

import qs from 'qs'

axios.interceptors.response.use(function (res) {
  return res
}, (err) => {
  return Promise.reject(err)
})

function getTodo(params?: any): Promise<Result> {
  // const query = qs.stringify(params)
  return axios.post(`http://localhost:1337/todos`, { data: params }).then((res) => {
    // let list: TodoItem[] = [];
    // let pagination: Pagination = {
    //   page: 0, pageCount: 0, pageSize: 0, total: 0
    // };
    const todos = (res.data.data).map((item: any) => {
      const {id, attributes} = item
      // const { content, created_at } = attributes
      return {
        // id, ...attributes
        ...item
      }
    })
    // list = todos
    // pagination = res.data.meta.pagination
    return Promise.resolve(
      {
        list: todos,
        pagination: {
          page: 1,
          pageSize: 1,
          pageCount: 1,
          total: res.data.pagination.total
        }
        // res.data.meta.pagination
      }
    )
  }, (err) => {
    return Promise.reject(err)
  })
}

function addOrUpdateTodo(todo: TodoItem) {
  return axios.post(`http://localhost:1337/addtodo`, {
    data: todo
  })
}

function putTodo(todo: TodoItem) {
  return axios.put(`http://localhost:1337/todos/${todo.id}`, {
    data: {content: todo.content, schedule_complete_time: todo.schedule_complete_time}
  })
}

function deleteTodo(id: number | undefined) {
  return axios.delete(`http://localhost:1337/todos/${id}`, {
    data: {}
  })
}

function getTodoComment(todoId: number | undefined) {
  return axios.get(`http://localhost:1337/todo-comments/${todoId}`).then((res) => {
    // let list: TodoItem[] = [];
    // let pagination: Pagination = {
    //   page: 0, pageCount: 0, pageSize: 0, total: 0
    // };
    const todos = (res.data.data).map((item: any) => {
      // const { content, created_at } = attributes
      return {
        ...item
      }
    })
    // list = todos
    // pagination = res.data.meta.pagination
    return Promise.resolve(
      {
        list: todos,
        // pagination: res.data.meta.pagination
      }
    )
  }, (err) => {
    return Promise.reject(err)
  })
}

function addTodoComment(comment: TodoComment) {
  return axios.post(`http://localhost:1337/todo-comments`, {
    data: comment
  })
}

function getUser() {
  return axios.get(`http://localhost:1337/api/users`).then((res) => {
    const todos = (res.data).map((item: any) => {
      return {
        ...item
      }
    })
    return Promise.resolve(
      {
        list: todos,
        // pagination: res.data.meta.pagination
      }
    )
  }, (err) => {
    return Promise.reject(err)
  })
}

export interface TodoItem {
  content: string;
  id?: number;
  schedule_complete_time: string
  created_at?: string;
  updated_at?: string;
}

export interface Pagination {
  page: number,
  pageSize: number,
  pageCount: number,
  total?: number;
}

interface Result {
  pagination: Pagination;
  list: TodoItem[];
}

export interface TodoComment {
  todo_id: number | undefined,
  comment: string
}

export {
  getTodo,
  addOrUpdateTodo,
  putTodo,
  deleteTodo,

  getTodoComment,
  addTodoComment,

  getUser
}

