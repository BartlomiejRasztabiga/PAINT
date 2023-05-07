import {UserGroupIcon} from "@heroicons/react/24/outline";
import {useEffect} from "react";
import {useStompClient} from "react-stomp-hooks";
import {Conversation} from "../models/conversation";
import {UserStatus} from "../models/user";
import {convoParticipantsNames, useGetConversations} from "../queries/conversations"
import {useGetUsers, useUpdateStatuses} from "../queries/users";
import useAuthStore from "../stores/auth";
import {useDashboardStore} from "../stores/dashboard";
import ConversationCreationModal from "./components/convo-creation-modal";
import MessagesView from "./components/messages"
import UserControlPanel from "./components/usercontrol"
import ActivityIndicator from "./components/activity-indicator";

export default function DashboardPage() {
  const users = useGetUsers();
  const currentUserId = useAuthStore(state => state.currentUserId);
  const { currentUser, setCurrentUser, selectedConversation, setSelectedConversation } = useDashboardStore();

  const stompClient = useStompClient();

  useEffect(() => {
    let user = users.data?.find((user) => user.id === currentUserId);

    if (user) {
      setCurrentUser(user);
      stompClient && stompClient!.publish({destination: "/app/status", body: JSON.stringify({userId: user!.id, status: "ONLINE"})})
    }
  }, [currentUserId, users.data, stompClient]);

  useUpdateStatuses()

  const conversations = useGetConversations();
  if (conversations.isLoading || users.isLoading || !currentUser) {
    return <div>Loading...</div>
  }

  if (conversations.isError || users.isError) {
    let error = conversations.error || users.error;
    return <div>Error: {error}</div>
  }

  return (
    <div id="dashboard-container" className="flex flex-row flex-nowrap flex-1 h-screen w-screen">
      <div id="dashboard-sidebar" className="flex flex-col w-80 bg-base-300">
        <div id="dashboard-sidebar__header" className="flex flex-row justify-between items-center p-4 border-b border-base-100">
          <p className="text-2xl font-bold">not-slack</p>
        </div>
        <div id="dashboard-sidebar__content" className="flex flex-col">
          <div id="sidebar-content__active-convos" className="flex flex-col justify-start w-full">
            <p className="text-sm font-light text-base-content px-4 py-2 bg-base-200 mb-1">ACTIVE CONVERSATIONS</p>
            { 
              (conversations.data && conversations.data.length > 0)
              ? conversations.data!.map((convo: Conversation) => {
                return (
                  <div className={`flex flex-row justify-start items-center px-4 hover:bg-white/5 hover:cursor-pointer`}
                    onClick={() => setSelectedConversation(convo)}>
                    {convo.userIds.length > 2
                      ? <UserGroupIcon className="h-5 w-5 text-base-content" />
                      : <ActivityIndicator userStatus={
                        users.data?.find((user) => user.id === convo.userIds.find((id) => id !== currentUser!.id))?.status || UserStatus.Offline
                      } />
                    } 
                    <div className={`pl-2 py-1 w-full ${selectedConversation === convo ? "font-bold bg-gray-500/5" : ""}`}>
                      <div className="text-base-content text-md text-ellipsis whitespace-nowrap overflow-hidden">
                        {convo.name ? convo.name : convoParticipantsNames(convo.userIds, users.data!, currentUser)}
                      </div>
                    </div>
                  </div>
                )
              })
              : <p className="px-4 py-2">No active conversations.</p>
            }
          </div>
          <label htmlFor="conversation-create-modal" className="btn btn-sm btn-outline mt-4 mx-4">New Conversation</label>
          <ConversationCreationModal />
          {/* <div id="sidebar-content__users" className="flex flex-col justify-start items-start w-full">
            <p className="text-sm font-light text-base-content px-4 py-2 bg-base-200 border-t border-base-100 w-full my-1">USERS</p>
            {users.data!.map((user: User) => {
              return (
                <div className="flex flex-row justify-start items-center px-4">
                  <div className="badge badge-xs badge-error"></div>
                  <div className="pl-2 py-1"><div className="text-base-content text-sm">{user.nickName}</div></div>
                </div>
              )
            })}
          </div> */}
        </div>
        <div className="flex-1"></div>
        <UserControlPanel />
      </div>
      <MessagesView />
    </div>
  )
}