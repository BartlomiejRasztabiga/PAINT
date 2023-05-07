package pl.edu.pw.elka.slack.users

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document
data class User(
    @Id
    val id: UUID,
    val username: String,
    var status: UserStatus = UserStatus.OFFLINE,
)
