package pl.edu.pw.elka.slack.conversation

import org.springframework.data.annotation.Id
import java.util.*

data class Conversation(
        @Id
        val id: UUID,
        val userIds: Set<UUID>,
        val name: String?,
)
