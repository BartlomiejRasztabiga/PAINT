import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
	id("org.springframework.boot") version "2.7.5"
	id("io.spring.dependency-management") version "1.0.15.RELEASE"
	id("groovy")
	kotlin("jvm") version "1.6.21"
	kotlin("plugin.spring") version "1.6.21"
	jacoco
}

group = "pl.edu.pw.elka"
version = "0.0.2-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-data-mongodb")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.keycloak:keycloak-spring-boot-starter:20.0.2")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	implementation("org.springframework.data:spring-data-mongodb:3.4.5")
	testImplementation("org.spockframework:spock-core:2.3-groovy-4.0")
	testImplementation("org.springframework.boot:spring-boot-starter-test:2.7.6")
	testImplementation("org.spockframework:spock-spring:2.3-groovy-4.0")
}

tasks.withType<KotlinCompile> {
	kotlinOptions {
		freeCompilerArgs = listOf("-Xjsr305=strict")
		jvmTarget = "17"
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.jacocoTestReport {
	reports {
		xml.required.set(true)
	}
}

tasks.test {
	finalizedBy("jacocoTestReport")
}

tasks.withType<JacocoReport> {
	afterEvaluate {
		classDirectories.setFrom(files(classDirectories.files.map {
			fileTree(it).apply {
				exclude("pl/edu/pw/elka/slack/*/Test.class")
			}
		}))
	}
}
