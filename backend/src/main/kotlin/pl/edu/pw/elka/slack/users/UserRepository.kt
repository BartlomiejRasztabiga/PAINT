package pl.edu.pw.elka.slack.users

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.*

interface UserRepository : MongoRepository<User, UUID> {
    fun findByUsername(username: String): User?
}
