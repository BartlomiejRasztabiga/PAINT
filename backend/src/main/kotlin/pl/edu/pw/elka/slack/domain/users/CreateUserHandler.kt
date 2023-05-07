package pl.edu.pw.elka.slack.domain.users

import org.springframework.stereotype.Component
import java.util.*

@Component
class CreateUserHandler(
    private val userRepository: UserRepository
) {

    fun createUser(command: CreateUserCommand): UUID {
        val user = User(command.id, command.firstName, command.lastName, command.nickName)
        userRepository.save(user)
        return user.id
    }
}

data class CreateUserCommand(
        val id: UUID,
        val firstName: String,
        val lastName: String,
        val nickName: String
)