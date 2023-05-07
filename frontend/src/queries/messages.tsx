import { useMutation, useQuery, useQueryClient } from "react-query"
import { Message } from "../models/messages"
import apiAxios from "./axios-api"

const fetchMessages = async (conversationId: string | undefined) => {
  if (!conversationId) {
    return []
  };
  const res = await apiAxios.get<Message[]>(`/conversation/${conversationId}/messages`)
  return res.data
}

interface PostMessageParams {
  conversationId: string,
  content: string,
}

const postMessage = async ({ conversationId, content }: PostMessageParams) => {
  await apiAxios.post(
    `/conversation/${conversationId}/messages`, {
    "content": content
  })
}

const useGetMessages = (conversationId: string | undefined) => useQuery('messages', () => fetchMessages(conversationId), {
  refetchInterval: 500,
  staleTime: 10 * (60 * 1000),
})

const useSendMessage = () => { 
  const queryClient = useQueryClient();
  return useMutation(postMessage, {
    onSuccess: () => {
      queryClient.invalidateQueries('messages')
    },
  });
}

export { useGetMessages, useSendMessage }