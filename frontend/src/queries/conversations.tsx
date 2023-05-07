import { useMutation, useQuery, useQueryClient } from "react-query"
import { Conversation } from "../models/conversation"
import { User } from "../models/user"
import apiAxios from "./axios-api"

const convoParticipantsNames = (participantIds: string[], users: User[], excludedUser?: User | null) => {
  let participants = participantIds;
  if (excludedUser) {
    participants = participants.filter((id: string) => id !== excludedUser.id);
  }

  return participants.map((id: string) => {
    let user = users.find((user) => user.id === id);
    return user ? user?.username : id;
  }).join(", ")
}

const convoParticipantsNicknames = (participantIds: string[], users: User[], excludedUser?: User | null) => {
  let participants = participantIds;
  if (excludedUser) {
    participants = participants.filter((id: string) => id !== excludedUser.id);
  }

  return participants.map((id: string) => {
    let user = users.find((user) => user.id === id);
    return user ? "@" + user?.username : id;
  }).join(", ")
}

const fetchConversations = async () => {
  const res = await apiAxios.get<Conversation[]>(`/conversations`)
  return res.data
}

const createConversation = async (participantIds: string[], name?: string) => {
  await apiAxios.post(
    `/conversations`, {
    "userIds": participantIds,
    // name is optional
    "name": name != "" ? name : null,
  })
}

const useGetConversations = () => {
  return useQuery(['conversations'], () => fetchConversations());
}

const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation(({userIds, name}: any) => createConversation(userIds, name), {
    onSuccess: () => {
      queryClient.invalidateQueries('conversations')
    },
  });
}

export { useGetConversations, useCreateConversation, convoParticipantsNames, convoParticipantsNicknames }
