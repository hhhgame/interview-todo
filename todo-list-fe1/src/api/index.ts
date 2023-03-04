import axios, {AxiosResponse} from "axios";
import qs from 'qs'
axios.interceptors.response.use(function (res) {
  return res
}, (err) => {
  return Promise.reject(err)
})

function getTodo(params?: any): Promise<Result> {
  const query = qs.stringify(params)
  return axios.get(`http://localhost:1337/api/todos?${query}`).then((res) => {
    // let list: TodoItem[] = [];
    // let pagination: Pagination = {
    //   page: 0, pageCount: 0, pageSize: 0, total: 0
    // };
    const todos = (res.data.data).map((item: any) => {
      const { id, attributes} = item
      // const { content, createdAt } = attributes
      return {
        id, ...attributes
      }
    })
    // list = todos
    // pagination = res.data.meta.pagination
    return Promise.resolve(
      {
        list: todos,
        pagination: res.data.meta.pagination
      }
    )
  }, (err) => {
    return Promise.reject(err)
  })
}
function addOrUpdateTodo(todo: TodoItem) {
  console.log('todo', todo)
  return axios.post(`http://localhost:1337/api/todos`, {
    data: todo
  })
}
function putTodo(todo: TodoItem) {
  return axios.put(`http://localhost:1337/api/todos/${todo.id}`, {
    data: { content: todo.content, scheduleCompleteTime: todo.scheduleCompleteTime }
  })
}
function deleteTodo(id: number | undefined) {
  return axios.delete(`http://localhost:1337/api/todos/${id}`, {
    data: { }
  })
}

function getTodoComment(todoId: number | undefined) {
  const filters = {
      todoID: {
        $eq: todoId,
      },
    }
  const query = qs.stringify({filters})
  return axios.get(`http://localhost:1337/api/todo-comments?${query}`).then((res) => {
    // let list: TodoItem[] = [];
    // let pagination: Pagination = {
    //   page: 0, pageCount: 0, pageSize: 0, total: 0
    // };
    const todos = (res.data.data).map((item: any) => {
      const { id, attributes} = item
      // const { content, createdAt } = attributes
      return {
        id, ...attributes
      }
    })
    // list = todos
    // pagination = res.data.meta.pagination
    return Promise.resolve(
      {
        list: todos,
        pagination: res.data.meta.pagination
      }
    )
  }, (err) => {
    return Promise.reject(err)
  })
}

function addTodoComment(comment: TodoComment) {
  return axios.post(`http://localhost:1337/api/todo-comments`, {
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
  scheduleCompleteTime: string
  createdAt?: string;
  updatedAt?: string;
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
  todoID: number | undefined,
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

