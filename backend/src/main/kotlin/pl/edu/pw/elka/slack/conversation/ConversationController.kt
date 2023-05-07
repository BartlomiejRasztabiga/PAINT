package pl.edu.pw.elka.slack.conversation

import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.util.*

@CrossOrigin
@RestController
@RequestMapping("/api/conversations")
class ConversationController(
    private val createConversationHandler: CreateConversationHandler,
    private val conversationRepository: ConversationRepository
) {

    @PostMapping
    fun createConversation(@RequestBody command: CreateConversationCommand): UUID {
        val currentUserId = UUID.fromString(((SecurityContextHolder.getContext().authentication as KeycloakAuthenticationToken).principal as Principal).name)
        command.userIds.plus(currentUserId)
        if (command.userIds.size < 2) {
            throw IllegalStateException("Conversation must have at least 2 users")
        }
        return createConversationHandler.create(command)
    }

    @GetMapping
    fun getConversations(): List<Conversation> {
        val currentUserId = UUID.fromString(((SecurityContextHolder.getContext().authentication as KeycloakAuthenticationToken).principal as Principal).name)
        return conversationRepository.findByUserIdsContaining(currentUserId)
    }
}
