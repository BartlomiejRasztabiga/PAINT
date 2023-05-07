package pl.edu.pw.elka.slack.conversation.message

import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class CreateMessageHandler(
    private val messageRepository: MessageRepository
) {

    fun create(command: CreateMessageCommand): UUID {
        val message = Message(
            UUID.randomUUID(),
            command.authorId,
            command.conversationId,
            command.content,
            command.createdAt
        )
        return messageRepository.save(message).id
    }
}

data class CreateMessageCommand(
    val authorId: UUID,
    val conversationId: UUID,
    val content: String,
    val createdAt: LocalDateTime
)