package pl.edu.pw.elka.slack.users.finder

import org.springframework.stereotype.Component
import pl.edu.pw.elka.slack.users.User
import pl.edu.pw.elka.slack.users.UserRepository
import java.util.UUID

@Component
class UserFinder(
    private val userRepository: UserRepository
) {

    fun getUsers(): List<User> {
        return userRepository.findAll()
    }

    fun getUserByID(id: UUID): User {
        return userRepository.findById(id).get()
    }
}
