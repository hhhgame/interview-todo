import e, { Express, Request, Response, Router } from 'express'
import { Todos, TodoComments } from '../db'
import { Op } from 'sequelize'
// 路由配置接口
interface RouterConf {
  path: string,
  router: Router,
  meta?: unknow
}

// 路由配置
const routerConf: Array<RouterConf> = []

function routes(app: Express) {
  // 根目录
  app.get('/', (req: Request, res: Response) => res.status(200).send('123'))

  app.post('/todos', async (req, res, next) => {
    // Todos.all((err: Error, todos: any[]) => {
    //   if (err) res.status(500).send({
    //     errorMsg: 'error'
    //   })
    //   else {
    //     res.send({
    //       data: todos
    //     })
    //   }
    // })
    const query = req.body.data
    const { page, pageSize  } = query.pagination
    console.log('query.pagination', query.pagination)
    // {
    // where : {
    // "fieldOfYourDate" : {
    // [Op.between] : [startedDate , endDate ]
    // }
    // }
    // }
    const searchQuery: any = {
      where: {}
    }
    if (query.filters && query.filters['schedule_complete_time']) {
      searchQuery.where['schedule_complete_time'] = {
        [Op.between] : query.filters['schedule_complete_time']['$between']//[startedDate , endDate ]
      }
    }
    if (query.filters && query.filters['created_at']) {
      searchQuery.where['created_at'] = {
        [Op.between] : query.filters['created_at']['$between']//[startedDate , endDate ]
      }
    }
    if (query.filters && query.filters['updated_at']) {
      searchQuery.where['updated_at'] = {
        [Op.between] : query.filters['updated_at']['$between']//[startedDate , endDate ]
      }
    }
    console.log('searchQuery', searchQuery)
    const todos = await Todos.findAll({
      ...searchQuery,
      limit: pageSize, // 每页多少条
      offset: pageSize * (page - 1)
    })
    const totalTodo = await Todos.findAll()
    const total = totalTodo.length
    res.send({
      data: todos,
      pagination: {
        page: page,
        pageSize: pageSize,
        pageCount: Math.ceil(total / pageSize),
        total: total
      }
    })
  });

  app.post('/addtodo', async (req, res, next) => {
    const todo = await Todos.create(req.body.data)
    res.send(todo)
  })

  app.delete('/todos/:id', async (req, res, next) => {
    await Todos.destroy({
      where: {
        id: req.params.id
      }
    })
    res.send({})
  });

  app.put('/todos/:id', async (req, res, next) => {
    await Todos.update(req.body.data, {
      where: {
        id: req.params.id
      }
    })
    res.send({})
  })

  app.get('/todo-comments/:todoId', async (req, res, next) => {
    const comments = await TodoComments.findAll({
      where: {
        todo_id: req.params.todoId
      }
    })
    res.send({
      data: comments,
    })
  })

  app.post('/todo-comments', async (req, res, next) => {
    const todo = await TodoComments.create(req.body.data)
    res.send(todo)
  })
  routerConf.forEach((conf) => app.use(conf.path, conf.router))
}

export default routes
