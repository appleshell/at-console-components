import React from 'react'
import { AsyncButton } from 'at-console-components'

export default function Base() {
  return (
    <AsyncButton onClick={() => new Promise((res) => setTimeout(res, 1000))}>
      Click
    </AsyncButton>
  )
}
