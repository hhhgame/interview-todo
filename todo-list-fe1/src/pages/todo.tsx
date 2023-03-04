import { getTodo, addOrUpdateTodo, TodoItem, Pagination, putTodo, deleteTodo } from '../api/index'
import { useRequest } from "ahooks";
import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Input, Popconfirm, Space, DatePicker } from "antd";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'

import type { FormInstance } from 'antd/es/form';
import type { PaginationProps } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import {
  FormOutlined,
  DeleteOutlined,
  CommentOutlined
} from '@ant-design/icons'
import Comment from './controls/comment'
const { RangePicker } = DatePicker
dayjs.extend(utc)
function Todo() {
  const [ form ] = Form.useForm();
  const [ filterForm ] = Form.useForm();
  const [todoItem, setTodoItem] = useState<TodoItem>()
  const formRef = React.useRef<FormInstance>(null);
  const columns: ColumnsType<TodoItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id! - b.id!,
        multiple: 3,
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '计划完成时间',
      dataIndex: 'scheduleCompleteTime',
      key: 'scheduleCompleteTime',
      sorter: {
        compare: (a, b) => {
          console.log(dayjs(a.scheduleCompleteTime!).valueOf())
          return dayjs(a.scheduleCompleteTime!).valueOf() - dayjs(b.scheduleCompleteTime!).valueOf()
        },
        multiple: 2,
      },
      render: (_, record) => {
        return (<div>{dayjs(record.scheduleCompleteTime).format('YYYY-MM-DD HH:mm:ss')}</div>)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: {
        compare: (a, b) => dayjs(a.createdAt!).valueOf() - dayjs(b.createdAt!).valueOf(),
        multiple: 1,
      },
      render: (_, record) => {
        return (<div>{dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>)
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (_, record) => {
        return (<div>{dayjs(record.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>)
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        // <Button size={'small'} onClick={() => { onEdit(record) }}>编辑</Button>
        <>
          <FormOutlined onClick={() => { onEdit(record) }} />
          <Popconfirm
            title="删除"
            description="确认删除吗?"
            onConfirm={() => { onDelete(record) }}
            okButtonProps={{ loading: deleteTodoLoading }}
            okText="确认"
            cancelText="取消"
          >
            <DeleteOutlined />
          </Popconfirm>
          <CommentOutlined onClick={() => { onComment(record) }} />
        </>
      ),
    },
  ]
  const [isOpen, setIsOpen] = useState(false)
  const [ todos, setTodos ] = useState<any>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(5)
  const [pagination, setPagination] = useState<PaginationProps>({
    defaultCurrent: 1,
    total: 0,
    pageSize: 1
  })

  const [isCommentOpen, setIsCommentOpen] = useState(false)

  const { data, error, loading, run } = useRequest(getTodo, {
    manual: true,
    onSuccess: (data) => {
      setTodos(data.list)
      setTotal(data.pagination.total || 0)
      // setPagination({
      //   current: data.pagination.page,
      //   total: data.pagination.total,
      //   pageSize: data.pagination.pageSize
      // })
    }
  });

  const getPagination = () => {
    const pagi = {
      page: pagination.current,
      pageSize: pagination.pageSize || 0,
      total: pagination.total
    }
    return pagi
  }

  const { data: addTodoRes, error: addTodoError, loading: addOrUpdateTodoLoading, run: runAddOrUpdateTodo } = useRequest(addOrUpdateTodo, {
    manual: true,
    onSuccess: (data) => {
      setIsOpen(false)
      run({ pagination: { page: currentPage, pageSize: pageSize } })
    }
  });

  const { data: updateTodoRes, error: updateTodoError, loading: updateTodoLoading, run: runUpdateTodo } = useRequest(putTodo, {
    manual: true,
    onSuccess: (data) => {
      setIsOpen(false)
      run({ pagination: { page: currentPage, pageSize: pageSize } })
    }
  });

  const { data: deleteTodoRes, error: deleteTodoError, loading: deleteTodoLoading, run: runDeleteTodo } = useRequest(deleteTodo, {
    manual: true,
    onSuccess: (data) => {
      setIsOpen(false)
      run({ pagination: { page: currentPage, pageSize: pageSize } })
    }
  });

  useEffect(() => {
    const filters = {
      // content: {
      //   $eq: '区恶趣味',
      // },
    }
    run({ filters, pagination: { page: currentPage, pageSize: pageSize } })
  }, [currentPage, pageSize])
  const addTodo = () => {
    setTodoItem({
      content: '',
      scheduleCompleteTime: ''
    })
    form.setFieldsValue({
      todo: '',
      scheduleCompleteTime: dayjs()
    })
    setIsOpen(true)
  }
  const handleOk = () => {
    formRef.current?.validateFields().then((isValid) => {
      console.log('isValid', isValid)
      if (!isValid) {
        return
      }
      const formValue = formRef.current?.getFieldsValue()
      let todo: TodoItem = {
        content: formValue.todo,
        scheduleCompleteTime: formValue.scheduleCompleteTime,
        id: todoItem?.id
      }
      if (todoItem?.id) {
        runUpdateTodo(todo)
      } else {
        runAddOrUpdateTodo(todo)
      }

      setIsOpen(false);
    })


  };

  const handleCancel = () => {
    setIsOpen(false);
  };
  const onFinish = (values: any) => {
    console.log('valuesvalues', values)
  }
  const onPageChange = (current: number, pageSize: number) => {
    setCurrentPage(current)
    setPageSize(pageSize)
  }

  const onEdit = (record: TodoItem) => {
    setTodoItem(record)
    form.setFieldsValue({
      todo: record.content,
      scheduleCompleteTime: dayjs(record.scheduleCompleteTime),
      id: record.id
    })
    setIsOpen(true)
  }

  const onDelete = (record: TodoItem) => {
    runDeleteTodo(record?.id)
  }
  const onComment = (record: TodoItem) => {
    setTodoItem(record)
    setIsCommentOpen(true)
  }
  type LayoutType = Parameters<typeof Form>[0]['layout'];
  const [formLayout, setFormLayout] = useState<LayoutType>('inline');
  const formItemLayout =
    formLayout === 'horizontal' ? { labelCol: { span: 4 }, wrapperCol: { span: 14 } } : null;

  const buttonItemLayout =
    formLayout === 'horizontal' ? { wrapperCol: { span: 14, offset: 4 } } : null;

  const [filter, setFilter] = useState<any>()

  const onFilterFinish = (values: any) => {
    console.log('Success:', values);
    let _filter: any = {}
    if (values.scheduleCompleteTime) {
      _filter['scheduleCompleteTime'] = {
        $between: [
          dayjs.utc(values.scheduleCompleteTime[0]).format(),
          dayjs.utc(values.scheduleCompleteTime[1]).format()
        ]
      }
    }
    if (values.createdAt) {
      _filter['createdAt'] = {
        $between: [
          dayjs.utc(values.createdAt[0]).format(),
          dayjs.utc(values.createdAt[1]).format()
        ]
      }
    }
    if (values.updatedAt) {
      _filter['updatedAt'] = {
        $between: [
          dayjs.utc(values.updatedAt[0]).format(),
          dayjs.utc(values.updatedAt[1]).format()
        ]
      }
    }
    run({filters: _filter, pagination: { page: currentPage, pageSize: pageSize }})
  };
  return (
    <>
      <Card title="Todo" extra={<Button type={'primary'} size={'small'} onClick={addTodo}>添加</Button>}>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            labelAlign="left"
            form={filterForm}
            style={{ maxWidth: '600px' }}
            onFinish={onFilterFinish}
          >
            <Form.Item label="计划完成时间" name="scheduleCompleteTime">
              <RangePicker showTime />
            </Form.Item>
            <Form.Item label="创建时间" name="createdAt" >
              <RangePicker showTime />
            </Form.Item>
            <Form.Item label="更新时间" name="updatedAt">
              <RangePicker showTime />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">确定</Button>
            </Form.Item>
          </Form>
          <Table rowKey={'id'} dataSource={ todos } columns={ columns } loading={ loading }
                 pagination={ { current: currentPage, total: total, pageSize: pageSize, onChange: onPageChange,
                   showSizeChanger: true, pageSizeOptions: [5, 10, 20, 50]
                 } }
          />
        </Space>
      </Card>
      <Modal title={ todoItem?.id ? '编辑' : '添加' } open={isOpen}
             closable={true} onOk={handleOk} onCancel={handleCancel}
             okText={'确定'}
             cancelText={'取消'}
             confirmLoading={addOrUpdateTodoLoading}
      >
        <Form
          form={form}
          ref={formRef}
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="todo"
            name="todo"
            rules={[{ required: true, message: '请输入todo' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="计划完成时间"
            name="scheduleCompleteTime"
            rules={[{ required: true, message: '请选择计划完成时间' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        </Form>
      </Modal>
      <Comment todoId={todoItem?.id} isOpen={isCommentOpen} dialogClose={() => { setIsCommentOpen(false) }} />
    </>
  )
}

export default Todo
