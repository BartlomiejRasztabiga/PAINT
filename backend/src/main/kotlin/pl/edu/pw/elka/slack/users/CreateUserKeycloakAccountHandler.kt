package pl.edu.pw.elka.slack.users

import org.jboss.resteasy.client.jaxrs.internal.ResteasyClientBuilderImpl
import org.keycloak.admin.client.KeycloakBuilder
import org.keycloak.representations.idm.CredentialRepresentation
import org.keycloak.representations.idm.UserRepresentation
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*

@Component
class CreateUserKeycloakAccountHandler(
    @Value("\${keycloak.auth-server-url}")
    private val keycloakUrl: String,
) {

    fun createAccount(command: CreateUserKeycloakAccountCommand): UUID {
        val keycloak = KeycloakBuilder.builder()
            .serverUrl(keycloakUrl)
            .realm("master")
            .username("admin")
            .password("admin")
            .clientId("admin-cli")
            .resteasyClient(
                ResteasyClientBuilderImpl().connectionPoolSize(10).build()
            )
            .build()

        val response = keycloak.realm("paint").users().create(
            UserRepresentation().apply {
                username = command.username
                credentials = listOf(
                    CredentialRepresentation().apply {
                        isTemporary = false
                        type = CredentialRepresentation.PASSWORD
                        value = command.password
                    }
                )
                isEnabled = true
            }
        )

        if (response.status != 201) {
            throw Exception("Failed to create user with username: ${command.username}")
        } else {
            val id = UUID.fromString(response.location.path.split("/").last())
            println("Created user with username: ${command.username} and id: $id")
            return id
        }
    }
}

data class CreateUserKeycloakAccountCommand(
    val username: String,
    val password: String
)
