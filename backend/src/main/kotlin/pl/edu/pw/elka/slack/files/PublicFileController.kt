package pl.edu.pw.elka.slack.files

import org.springframework.core.io.ByteArrayResource
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RestController
import java.nio.file.Files
import java.nio.file.Paths
import java.util.*
import kotlin.io.path.createDirectory
import kotlin.io.path.notExists


@CrossOrigin
@RestController
class PublicFileController {

    @GetMapping("/files/{fileName}")
    fun downloadFile(@PathVariable fileName: String): ResponseEntity<ByteArrayResource> {
        try {
            val directory = Paths.get("/uploads")
            if (directory.notExists()) {
                directory.createDirectory()
            }
        } catch (e: Exception) {
            println(e.message)
            throw e
        }

        val path = Paths.get("/uploads/$fileName")
        val fileBytes = Files.readAllBytes(path)
        val resource = ByteArrayResource(fileBytes)

        return ResponseEntity.ok()
            .header("Content-Disposition", "attachment; filename=\"$fileName\"")
            .contentLength(fileBytes.size.toLong())
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource)
    }

}
