package pl.edu.pw.elka.slack.users.status

import pl.edu.pw.elka.slack.users.UserStatus
import java.util.UUID


data class StatusDTO(
    val userId: UUID,
    val status: UserStatus
)
