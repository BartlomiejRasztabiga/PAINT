import {useQuery, useQueryClient} from "react-query"
import {useSubscription} from "react-stomp-hooks"
import { User } from "../models/user"
import apiAxios from "./axios-api"

const fetchUsers = async () => {
  const res = await apiAxios.get<User[]>(`/users`)
  return res.data
}

const useGetUsers = () => useQuery('users', fetchUsers)

const useUpdateStatuses = () => {
  const queryClient = useQueryClient()

  useSubscription("/topic/statuses", (message) => {
    queryClient.invalidateQueries('users')
  })
}

export { useGetUsers, useUpdateStatuses }