package pl.edu.pw.elka.slack.users.status

import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.RestController
import pl.edu.pw.elka.slack.users.UserRepository
import pl.edu.pw.elka.slack.users.finder.UserFinder

@RestController
@CrossOrigin
class StatusController(
    val template: SimpMessagingTemplate,
    private val userFinder: UserFinder,
    private val userRepository: UserRepository
) {
    @MessageMapping("/status")
    fun status(@Payload message: StatusDTO) {
        val user = userFinder.getUserByID(message.userId)
        user.status = message.status
        userRepository.save(user)
        template.convertAndSend("/topic/statuses", message)
    }
}
