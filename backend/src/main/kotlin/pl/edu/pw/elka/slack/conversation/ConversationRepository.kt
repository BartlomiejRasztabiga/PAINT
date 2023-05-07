package pl.edu.pw.elka.slack.conversation

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.*

interface ConversationRepository : MongoRepository<Conversation, UUID> {
    fun findByUserIdsContaining(userId: UUID): List<Conversation>
}