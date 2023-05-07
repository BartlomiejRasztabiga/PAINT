package pl.edu.pw.elka.slack.conversation.message

import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import pl.edu.pw.elka.slack.users.UserRepository
import java.security.Principal
import java.time.LocalDateTime
import java.util.*

@CrossOrigin
@RestController
@RequestMapping("/conversation/{conversationId}/messages")
class MessageController(
    private val createMessageHandler: CreateMessageHandler,
    private val messageRepository: MessageRepository,
    private val userRepository: UserRepository
) {

    @GetMapping
    fun getMessages(@PathVariable conversationId: UUID): List<MessageResponse> {
        val users = userRepository.findAll()

        return messageRepository.findByConversationId(conversationId).map {
            val author = users.firstOrNull { user -> user.id == it.authorId }
            MessageResponse(
                id = it.id,
                authorId = it.authorId,
                authorName = author?.username,
                conversationId = it.conversationId,
                content = it.content,
                createdAt = it.createdAt
            )
        }
    }

    @PostMapping
    fun createMessage(
        @RequestBody request: CreateMessageRequest,
        @PathVariable conversationId: UUID
    ): UUID {
        val currentUserId =
            UUID.fromString(((SecurityContextHolder.getContext().authentication as KeycloakAuthenticationToken).principal as Principal).name)
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
