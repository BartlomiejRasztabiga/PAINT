FROM openjdk:17-slim
RUN mkdir /etc/spring && useradd spring && chown -R spring /etc/spring
USER spring
VOLUME /tmp
EXPOSE 8080
COPY build/libs/slack-backend-0.0.2-SNAPSHOT.jar /etc/spring/slack.jar
ENTRYPOINT java -jar /etc/spring/slack.jar --spring.config.location=optional:file:/etc/spring/config/application.properties,classpath:/

