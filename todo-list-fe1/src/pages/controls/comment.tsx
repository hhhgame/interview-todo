import React, {FC, useEffect, useState} from 'react'
import {Modal,List, Mentions} from "antd"
import type { MentionsOptionProps } from 'antd/es/mentions';
import {useRequest} from "ahooks";
import {getTodoComment, TodoComment, addTodoComment, getUser, addOrUpdateTodo} from "../../api";

type Props = {
  todoId: number | undefined,
  isOpen: boolean,
  dialogClose?: () => void
};
const Comment: FC<Props> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [todoId, setTodoId] = useState<number | undefined>(undefined)
  const [comments, setComments] = useState<TodoComment[]>([])
  const [comment, setComment] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const {data, error, loading, run} = useRequest(getTodoComment, {
    manual: true,
    onSuccess: (data) => {
      console.log(data, 'data')
      setComments(data.list.map((item:TodoComment) => {
        return {
          comment: item.comment,
          todoId: item.todoID
        }
      }))
      // setTodos(data.list)
      // setTotal(data.pagination.total || 0)
    }
  });
  const { data: addTodoCommentRes, error: addTodoCommentError, loading: addTodoCommentLoading, run: runAddTodoComment } = useRequest(addTodoComment, {
    manual: true,
    onSuccess: (data) => {
      setIsModalOpen(false)
      props?.dialogClose && props?.dialogClose()
      setTodoId(undefined)
      setComment('')
      run(todoId)
    }
  });
  const {data: getUserRes, error: getUserError, loading: getUserLoading, run: getUserRun} = useRequest(getUser, {
    manual: true,
    onSuccess: (data) => {
      setUsers(data.list.map((item: any) => {
        return {
          value: item.username,
          label: item.username,
        }
      }))
    }
  });

  useEffect(() => {
    if (isModalOpen) {
      setTodoId(props.todoId)
      setComment('')
    }
  }, [isModalOpen])
  useEffect(() => {
    setTodoId(props.todoId)
  }, [props.todoId])
  useEffect(() => {
    if (todoId !== undefined)
      run(todoId)
    getUserRun()
  }, [todoId])
  useEffect(() => {
    setIsModalOpen(props.isOpen)
  }, [props.isOpen])
  useEffect(() => {
    console.log('usersusersusers', users)
  }, [users])
  const handleOk = () => {
    runAddTodoComment({
      comment: comment,
      todoID: todoId
    })
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    props?.dialogClose && props?.dialogClose()
    setTodoId(undefined)
    setComment('')
  }
  const onChange = (value: string) => {
    setComment(value)
  };

  const onSelect = (option: MentionsOptionProps) => {
    if (option.value)
      setComment(option.value)
  };
  return (
    <Modal title={'评论'} open={isModalOpen}
           closable={true} onOk={handleOk} onCancel={handleCancel}
           okText={'确定'}
           cancelText={'取消'}
           confirmLoading={addTodoCommentLoading}
    >
      <div>
        <List dataSource={comments}
              renderItem={(item) => {
                return (
                  <List.Item>
                    <span>{ item.comment }</span>
                  </List.Item>
                )
              }}
        />
        <Mentions
          style={{ width: '100%' }}
          options={users}
          value={comment}
          onChange={onChange}
          onSelect={onSelect}
        />
      </div>
    </Modal>
  )
}

export default Comment
