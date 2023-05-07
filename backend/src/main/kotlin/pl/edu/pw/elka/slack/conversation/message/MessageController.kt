package pl.edu.pw.elka.slack.conversation.message

import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.security.Principal
import java.time.LocalDateTime
import java.util.*

@CrossOrigin
@RestController
@RequestMapping("/api/conversation/{conversationId}/messages")
class MessageController(
    private val createMessageHandler: CreateMessageHandler,
    private val messageRepository: MessageRepository
) {

    @GetMapping
    fun getMessages(@PathVariable conversationId: UUID): List<Message> {
        return messageRepository.findByConversationId(conversationId)
    }

    @PostMapping
    fun createMessage(
        @RequestBody request: CreateMessageRequest,
        @PathVariable conversationId: UUID
    ): UUID {
        val currentUserId = UUID.fromString(((SecurityContextHolder.getContext().authentication as KeycloakAuthenticationToken).principal as Principal).name)
        val command = CreateMessageCommand(
            currentUserId,
            conversationId,
            request.content,
            LocalDateTime.now()
        )
        return createMessageHandler.create(command)
    }


    data class CreateMessageRequest(
        val content: String,
    )
}
