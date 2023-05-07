package pl.edu.pw.elka.slack.users

import org.springframework.stereotype.Component
import java.util.*

@Component
class CreateUserHandler(
    private val userRepository: UserRepository
) {

    fun createUser(command: CreateUserCommand): UUID {
        if (userRepository.findByUsername(command.username) != null) {
            throw Exception("User with username ${command.username} already exists")
        }

        val user = User(command.id, command.username)
        userRepository.save(user)
        return user.id
    }
}

data class CreateUserCommand(
    val id: UUID,
    val username: String
)
