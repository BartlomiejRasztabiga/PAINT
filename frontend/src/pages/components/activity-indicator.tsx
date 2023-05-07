import React from 'react'
import { UserStatus } from '../../models/user'

type IndicatorSize = "small" | "medium" | "large"

const sizeToClassName = {
  "small": 'badge-xs',
  "medium": 'badge-sm',
  "large": 'badge-md',
}

const statusToClassName = {
  [UserStatus.Offline]: 'badge-error',
  [UserStatus.Online]: 'badge-success',
}

type ActivityIndicatorProps = {
  userStatus: UserStatus,
  size?: IndicatorSize,
}

export default function ActivityIndicator({userStatus, size = "medium"}: ActivityIndicatorProps) {
  return (
    <div className={`badge ${sizeToClassName[size]} ${statusToClassName[userStatus]}`}></div>
  )
}
