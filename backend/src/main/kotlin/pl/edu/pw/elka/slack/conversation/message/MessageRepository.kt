package pl.edu.pw.elka.slack.conversation.message

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.*

interface MessageRepository : MongoRepository<Message, UUID> {
    fun findByConversationId(conversationId: UUID): List<Message>
}
