package pl.edu.pw.elka.slack.files

import org.keycloak.adapters.springsecurity.token.KeycloakAuthenticationToken
import org.springframework.http.*
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile
import pl.edu.pw.elka.slack.conversation.message.CreateMessageCommand
import pl.edu.pw.elka.slack.conversation.message.CreateMessageHandler
import java.nio.file.Files
import java.nio.file.Paths
import java.security.Principal
import java.time.LocalDateTime
import java.util.*
import kotlin.io.path.createDirectory
import kotlin.io.path.notExists

@CrossOrigin
@RestController
@RequestMapping("/conversation/{conversationId}/files")
class FileController(
    private val createMessageHandler: CreateMessageHandler
) {

    @PostMapping
    fun uploadFile(@RequestParam file: MultipartFile, @PathVariable conversationId: UUID): UUID {
        val currentUserId =
            UUID.fromString(((SecurityContextHolder.getContext().authentication as KeycloakAuthenticationToken).principal as Principal).name)

        val link = uploadFile(file)

        val command = CreateMessageCommand(
            currentUserId,
            conversationId,
            link,
            LocalDateTime.now()
        )
        return createMessageHandler.create(command)
    }

    private fun uploadFile(file: MultipartFile): String {
        val extension = file.originalFilename!!.substringAfterLast(".")
        val newFileName = UUID.randomUUID().toString() + "." + extension

        try {
            val directory = Paths.get("/uploads")
            if (directory.notExists()) {
                directory.createDirectory()
            }

            val path = Paths.get("/uploads/${newFileName}")
            Files.createFile(path)
            file.transferTo(path)
        } catch (e: Exception) {
            println(e.message)
            throw e
        }

        return "https://paint.rasztabiga.me/api/files/${newFileName}"
    }
}
