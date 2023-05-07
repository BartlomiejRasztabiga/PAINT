package pl.edu.pw.elka.slack.conversation

import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.util.*

@CrossOrigin
@RestController
@RequestMapping("/conversations")
class ConversationController(
    private val createConversationHandler: CreateConversationHandler,
    private val conversationRepository: ConversationRepository
) {

    @PostMapping
    fun createConversation(@RequestBody command: CreateConversationCommand): UUID {
        val currentUserId = UUID.fromString(((SecurityContextHolder.getContext().authentication as KeycloakAuthenticationToken).principal as Principal).name)
        val usersIds = command.userIds.plus(currentUserId)
        if (usersIds.size < 2) {
            throw IllegalStateException("Conversation must have at least 2 users")
        }
        return createConversationHandler.create(CreateConversationCommand(command.name, usersIds))
    }

    @GetMapping
    fun getConversations(): List<Conversation> {
        val currentUserId = UUID.fromString(((SecurityContextHolder.getContext().authentication as KeycloakAuthenticationToken).principal as Principal).name)
        return conversationRepository.findByUserIdsContaining(currentUserId)
    }
}
