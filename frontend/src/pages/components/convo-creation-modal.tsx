import React from 'react'
import { User, UserStatus } from '../../models/user'
import { useDashboardStore } from '../../stores/dashboard'
import { useGetUsers } from '../../queries/users'
import { convoParticipantsNames, useCreateConversation, useGetConversations } from '../../queries/conversations'
import ActivityIndicator from './activity-indicator'

type ConversationParticipantEntryProps = {
  user: User,
  status: UserStatus,
  removeCallback?: () => void,
}
// a small rounded rectangle with status, name (and nickname below), and a button to remove (optional)
function ConversationParticipantEntry({ user, status, removeCallback }: ConversationParticipantEntryProps) {
  return (
    <div className="flex flex-row gap-2 items-center px-4 py-2 rounded-3xl bg-base-100/75">
      <ActivityIndicator userStatus={user.status}/>
      <div className="flex flex-col -mt-1">
        <p className="font-bold">{user.firstName} {user.lastName}</p>
        <p className="text-xs -mt-1 text-base-content/75">@{user.nickName}</p>
      </div>
      {removeCallback && <button className="btn btn-sm opacity-50 btn-circle ml-2 -mr-1" onClick={() => removeCallback()}>✕</button>}
    </div>
  )
}

export default function ConversationCreationModal() {
  const { currentUser, currentUserStatus: currentStatus } = useDashboardStore();
  const setSelectedConversation = useDashboardStore(state => state.setSelectedConversation);
  const createConversation = useCreateConversation();
  const conversations = useGetConversations(currentUser!);
  const users = useGetUsers();
  const [usersFilter, setUsersFilter] = React.useState("");
  const [conversationName, setConversationName] = React.useState("");
  const [participants, setParticipants] = React.useState<User[]>([]);

  const handleClose = () => {
    setUsersFilter("");
    setConversationName("");
    setParticipants([]);
  }

  const handleCreate = () => {
    createConversation.mutate({ userIds: participants.map((user) => user.id), name: conversationName ?? null}, {
      onSuccess: (data) => {
        // server returns the ID of the newly created conversation
        // we need to find it in the list of conversations and set it as selected
        let conversation = conversations.data?.find((conversation) => conversation.id === data);
        if (!conversation) return;
        setSelectedConversation(conversation);
      }
    });
    handleClose();
  }

  if (users.isLoading) return (<></>);
  if (users.isError) return (<>Error loading users list</>);

  let filteredUsers = users.data?.filter((user) => user.id !== currentUser?.id && !participants.includes(user));
  if (usersFilter) {
    filteredUsers = filteredUsers?.filter((user) => user.firstName.toLowerCase().includes(usersFilter.toLowerCase()) || user.lastName.toLowerCase().includes(usersFilter.toLowerCase()) || user.nickName.toLowerCase().includes(usersFilter.toLowerCase()));
  }

  let participantIds = participants.map((user) => user.id);

  return (<>
    <input type="checkbox" id="conversation-create-modal" className="modal-toggle" />
    <div className="modal">
      <div className="modal-box relative flex flex-col gap-2 w-xl max-w-2xl">
        <label htmlFor="conversation-create-modal" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => handleClose()}>✕</label>
        <h3 className="font-bold text-2xl mb-2">Create a conversation</h3>
        <p className="text-base-content/75">Name</p>
        <input type="text" className="bg-base-200 input w-full mb-2" 
                           placeholder={participantIds.length > 0 ? convoParticipantsNames(participantIds, users.data!) : "Enter a name... "} 
                           value={conversationName} onChange={(e) => setConversationName(e.target.value)}
                           disabled={participants.length < 2}/>
        <p className="text-base-content/75">Participants</p>
        <div className="bg-base-200 rounded-2xl p-2 flex flex-row flex-wrap gap-1">
          <ConversationParticipantEntry user={currentUser!} status={currentStatus}></ConversationParticipantEntry>
          {participants.map((user) => <ConversationParticipantEntry 
                              user={user} status={UserStatus.Online} 
                              removeCallback={() => setParticipants(participants.filter((u) => u.id !== user.id))} />)}
        </div>
        <p className="text-base-content/75 mt-2">Available users</p>
        <label className="bg-base-200 rounded-2xl p-2">
          <input type="text" placeholder="Search users..." className="input w-full mb-2" value={usersFilter} onChange={(e) => setUsersFilter(e.target.value)} />
          <div className="flex flex-col gap-1">
            { (filteredUsers == null || filteredUsers!.length <= 0)
              ? <p className="text-center py-2 bg-base-100/75 rounded-2xl">No users found!</p>
              : filteredUsers!.map((user) => { 
                return (
                  <div className="flex flex-row items-center justify-between px-4 py-2 rounded-xl bg-base-100/75">
                    <div className='flex flex-row gap-2 items-center'>
                      <ActivityIndicator userStatus={user.status}/>
                      <div className="flex flex-col -mt-1">
                        <p className="font-bold">{user.firstName} {user.lastName}</p>
                        <p className="text-sm -mt-1 text-base-content/75">@{user.nickName}</p>
                      </div>
                    </div>
                    <button className="btn btn-md btn-outline btn-accent opacity-75" onClick={() => setParticipants([...participants, user])}>Add</button>
                  </div>
                )
            })}
          </div>
        </label>
        <div className="modal-action">
          <label htmlFor="conversation-create-modal" className={`btn btn-primary ${participants.length > 0 ? "" : "btn-disabled"}`} onClick={() => handleCreate()}>Create</label>
        </div>
      </div>
    </div>
  </>)
}
