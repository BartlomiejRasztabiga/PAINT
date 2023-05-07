package pl.edu.pw.elka.slack.conversation

import org.spockframework.spring.SpringBean
import org.springframework.beans.factory.annotation.Autowired
import pl.edu.pw.elka.slack.BaseTest

class CreateConversationHandlerTest extends BaseTest {
    @Autowired
    private CreateConversationHandler handler

    @SpringBean
    private ConversationRepository conversationRepository = Mock()

    def "when conversation is created, it should be saved to repository"() {
        given:
        def conversation = new CreateConversationCommand("sample", [UUID.randomUUID()] as Set)

        when:
        handler.create(conversation)

        then:
        1 * conversationRepository.save(_) >> new Conversation(UUID.randomUUID(), [] as Set, "sample")
    }
}
