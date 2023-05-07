package pl.edu.pw.elka.slack.users

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import pl.edu.pw.elka.slack.users.finder.UserFinder
import java.util.*

@CrossOrigin
@RestController
@RequestMapping("/users")
class UserController(
    private val createUserHandler: CreateUserHandler,
    private val createUserKeycloakAccountHandler: CreateUserKeycloakAccountHandler,
    private val userFinder: UserFinder,
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createUser(@RequestBody request: CreateUserRequest): UUID {
        val createKeycloakAccountCommand = CreateUserKeycloakAccountCommand(
            username = request.username,
            password = request.password
        )

        val id = createUserKeycloakAccountHandler.createAccount(createKeycloakAccountCommand)

        val createUserCommand = CreateUserCommand(
            id = id,
            username = request.username
        )

        return createUserHandler.createUser(createUserCommand)
    }

    @GetMapping
    fun getUsers(): List<User> {
        return userFinder.getUsers()
    }

    data class CreateUserRequest(
        val username: String,
        val password: String
    )
}
