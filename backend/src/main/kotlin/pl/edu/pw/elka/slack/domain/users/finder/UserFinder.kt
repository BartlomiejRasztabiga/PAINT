package pl.edu.pw.elka.slack.domain.users.finder

import org.springframework.stereotype.Component
import pl.edu.pw.elka.slack.domain.users.User
import pl.edu.pw.elka.slack.domain.users.UserRepository

@Component
class UserFinder(
    private val userRepository: UserRepository
) {

    fun getUsers(): List<User> {
        return userRepository.findAll()
    }
}