import React, { FC, MouseEventHandler, useState } from 'react'
import { Modal, Form as AntdForm } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import { Store } from 'antd/lib/form/interface'
import Form, { FormProps } from '../form'
import { isFunc } from '../utils/is'

const { useForm } = AntdForm

export interface ModalFormProps extends ModalProps {
  formProps: FormProps
  /**
   * Trigger after form finish, return false can prevent Modal cancel
   */
  onOk?: (values: Store) => Promise<unknown> | false | void
  onCancel?: () => void
  /**
   * Trigger before form finish, return reject can prevent form finish
   */
  onBeforeOk?: (values: Store) => Promise<unknown> | void
}

const ModalForm: FC<ModalFormProps> = ({
  formProps,
  onOk,
  visible,
  onBeforeOk,
  ...props
}) => {
  const [form] = useForm(formProps?.form)
  const [loading, setLoading] = useState(false)

  const onModalOk: MouseEventHandler = async () => {
    form.submit()
  }

  const onModalFormFinish = async (values: Store) => {
    try {
      setLoading(true)
      if (isFunc(onBeforeOk)) {
        await onBeforeOk(values)
      }
      let isNeedCloseWhenOnFinish = true
      const { onCancel } = props
      if (isFunc(formProps.onFinish)) {
        await formProps.onFinish(values)
      }
      if (isFunc(onOk)) {
        const result = await onOk(values)
        result === false && (isNeedCloseWhenOnFinish = result)
      }

      if (isNeedCloseWhenOnFinish && isFunc(onCancel)) {
        onCancel()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      onOk={onModalOk}
      confirmLoading={loading}
      visible={visible}
      destroyOnClose
      {...props}
    >
      <Form {...formProps} form={form} onFinish={onModalFormFinish} />
    </Modal>
  )
}

export default ModalForm
