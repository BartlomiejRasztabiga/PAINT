package pl.edu.pw.elka.slack.conversation.message

import java.time.LocalDateTime
import java.util.*

data class MessageResponse(
    val id: UUID,
    val authorId: UUID,
    val authorName: String?,
    val conversationId: UUID,
    val content: String,
    val createdAt: LocalDateTime
)
