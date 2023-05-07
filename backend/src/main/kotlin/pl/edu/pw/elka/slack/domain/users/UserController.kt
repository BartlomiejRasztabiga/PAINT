package pl.edu.pw.elka.slack.domain.users

import org.keycloak.KeycloakPrincipal
import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import pl.edu.pw.elka.slack.domain.users.finder.UserFinder
import java.security.Principal
import java.util.*

@CrossOrigin
@RestController
@RequestMapping("/api/users")
class UserController(
        private val createUserHandler: CreateUserHandler,
        private val userFinder: UserFinder,
        private val userRepository: UserRepository
) {

    @PostMapping
    fun createUser(): UUID {
        val authentication = SecurityContextHolder.getContext().authentication as KeycloakAuthenticationToken

        val principal: Principal = authentication.principal as Principal

        if (!(principal is KeycloakPrincipal<*>)) {
            throw IllegalStateException("Principal is not KeycloakPrincipal")
        }

        val id = UUID.fromString(principal.name)

        if (userRepository.existsById(id)) {
            return id
        }


        val token = principal.keycloakSecurityContext.token

        val command = CreateUserCommand(
                id = id,
                firstName = token.givenName,
                lastName = token.familyName,
                nickName = token.preferredUsername
        )

        return createUserHandler.createUser(command)
    }

    @GetMapping
    fun getUsers(): List<User> {
        return userFinder.getUsers()
    }
}
