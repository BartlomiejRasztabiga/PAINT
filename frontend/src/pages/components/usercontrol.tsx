import { PowerIcon } from '@heroicons/react/24/outline'
import React, {useEffect, useState} from 'react'
import useAuthStore from '../../stores/auth'
import { useDashboardStore } from '../../stores/dashboard'
import ActivityIndicator from "./activity-indicator";
import {useStompClient} from "react-stomp-hooks";

export default function UserControlPanel() {
  const user = useDashboardStore(state => state.currentUser)
  const logoutUser = useAuthStore(state => state.logout)
  const [userLoggedOff, setUserLoggedOff] = useState(false)
  const { reset: dashboardStoreReset } = useDashboardStore()

  const stompClient = useStompClient();

  const handleLogout = () => {
    logoutUser();
    dashboardStoreReset();
  }

  useEffect(() => {
    userLoggedOff && stompClient && stompClient.publish({destination: "/app/status", body: JSON.stringify({userId: user!.id, status: "OFFLINE"})})
    userLoggedOff && handleLogout()
  }, [userLoggedOff, stompClient])

  return (
    <div id="dashboard-sidebar__settings" className="flex flex-col p-4 bg-base-200 justify-start items-start w-full">
      <div className="flex flex-row items-center justify-between font-bold text-large text-base-content w-full my-1 mt-auto">
        <div className='flex flex-row items-center justify-start w-full'>
          <ActivityIndicator userStatus={user!.status}/>
          <div className='flex flex-col items-start justify-center ml-2'>
            <p className="text-base-content/50 text-base font-normal -mt-1">
              @{user?.username}
            </p>
          </div>
        </div>
        <button className="btn btn-square ml-4" onClick={() =>
        {
          setUserLoggedOff(true)
        }}>
          <PowerIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
