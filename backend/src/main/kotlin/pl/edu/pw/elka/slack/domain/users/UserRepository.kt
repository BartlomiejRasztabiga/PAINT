package pl.edu.pw.elka.slack.domain.users

import org.springframework.data.mongodb.repository.MongoRepository
import java.util.*

interface UserRepository : MongoRepository<User, UUID>