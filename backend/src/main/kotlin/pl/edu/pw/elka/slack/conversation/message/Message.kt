package pl.edu.pw.elka.slack.conversation.message

import org.springframework.data.annotation.Id
import java.time.LocalDateTime
import java.util.*

data class Message(
    @Id
    val id: UUID,
    val authorId: UUID,
    val conversationId: UUID,
    val content: String,
    val createdAt: LocalDateTime
)
