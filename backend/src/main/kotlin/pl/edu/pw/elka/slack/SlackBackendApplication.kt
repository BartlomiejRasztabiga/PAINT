package pl.edu.pw.elka.slack

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SlackBackendApplication

fun main(args: Array<String>) {
	runApplication<SlackBackendApplication>(*args)
}
