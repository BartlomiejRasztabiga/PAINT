package pl.edu.pw.elka.slack.conversation

import org.springframework.stereotype.Component
import java.util.*

@Component
class CreateConversationHandler(
    private val conversationRepository: ConversationRepository
) {

    fun create(command: CreateConversationCommand): UUID {
        val conversation = Conversation(UUID.randomUUID(), command.userIds, command.name)
        return conversationRepository.save(conversation).id
    }
}

data class CreateConversationCommand(
        val name: String?,
        val userIds: Set<UUID>
)