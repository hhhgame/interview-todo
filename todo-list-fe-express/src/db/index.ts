import { Sequelize, DataTypes } from 'sequelize'

const sqlite3 = require('sqlite3').verbose()
const dbname = 'mysqlite.db';
// 创建并连接一个数据库
const db = new sqlite3.Database(dbname)

// 创建todo表
db.serialize(() => {
  // const sql = `
  //       CREATE TABLE IF NOT EXISTS articles
  //       (id integer primary key,title,content TEXT)
  //   `;
  // console.log('table create')
  // // 如果没有articles表,创建一个
  // try {
  //   db.run(sql);
  // } catch (e) {
  //   console.log('eee', e)
  // }

})

// class Todos {
//   // 获取所有文章
//   static all(cb: (err: Error, todos: any[]) => void) {
//     // 使用sqlite3的all
//     db.all('SELECT * FROM todos', cb);
//   }
// }

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbname
});

// ;(async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//   }
// }) ()

const Todos = sequelize.define('Todos', {
  // 在这里定义模型属性
  id: {
    type: DataTypes.INTEGER,
    // allowNull: false,
    primaryKey: true
  },
  content: {
    type: DataTypes.STRING
    // allowNull 默认为 true
  },
  created_at: {
    type: DataTypes.DATE
  },
  updated_at: {
    type: DataTypes.DATE
  },
  published_at: {
    type: DataTypes.DATE
  },
  schedule_complete_time: {
    type: DataTypes.DATE
  }
}, {
  // 这是其他模型参数
  timestamps: false
});

const TodoComments = sequelize.define('todo_comments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  todo_id: {
    type: DataTypes.INTEGER,
  },
  comment: {
    type: DataTypes.TEXT,
  }
}, {
  // 这是其他模型参数
  timestamps: false
})

export {
  db,
  Todos,
  TodoComments
}
