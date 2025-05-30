plugins {
    java
    application
}

group = "labs"
version = project.property("version") as String

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

application {
    mainClass.set(project.property("mainClass") as String)
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("jakarta.platform:jakarta.jakartaee-web-api:9.1.0")
    implementation("org.eclipse.persistence:org.eclipse.persistence.jpa:3.0.2")
    implementation("org.postgresql:postgresql:42.7.2")
    implementation("org.apache.logging.log4j:log4j-api:2.12.0")
    implementation("org.glassfish:jakarta.faces:4.1.2")
    implementation("org.projectlombok:lombok:1.18.30")
    implementation("org.primefaces:primefaces:12.0.0:jakarta")
    implementation("javax.persistence:javax.persistence-api:2.2")
    implementation("org.hibernate:hibernate-core:5.6.7.Final")
    implementation("org.hibernate.orm:hibernate-core:6.6.1.Final")

    testImplementation("org.junit.jupiter:junit-jupiter-api:5.9.2")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.9.2")
}

tasks.test {
    useJUnitPlatform()
    reports.junitXml.required.set(true)
    reports.html.required.set(true)
    reports.junitXml.outputLocation.set(file(project.property("reportDir") as String))
}

tasks.jar {
    manifest {
        attributes(
            "Main-Class" to project.property("mainClass"),
            "Implementation-Version" to project.property("version")
        )
    }
}

tasks.register("clear") {
    description = "Cleans build dirs and reports"
    dependsOn("clean")
    doLast {
        delete(project.property("reportDir") as String)
    }
}

tasks.register("music") {
    description = "Play music when build is finished"
    doLast {
        exec {
            commandLine("afplay", project.property("musicFile") as String)
            isIgnoreExitValue = true
        }
    }
}

tasks.register("report") {
    description = "Add and commit JUnit reports"
    dependsOn("test")
    doLast {
        val reportDir = project.property("reportDir") as String
        val reportFiles = fileTree(reportDir).matching { include("*.xml") }.files

        if (reportFiles.isNotEmpty()) {
            exec {
                commandLine("git", "add", "$reportDir/*.xml")
                isIgnoreExitValue = true
            }
            exec {
                commandLine("git", "commit", "-m", project.property("gitCommitMsg") as String)
                isIgnoreExitValue = true
            }
        } else {
            println("Нет отчётов для git add: $reportDir/*.xml (пропуск)")
        }
    }
}

tasks.register("push") {
    description = "Push commits"
    dependsOn("report")
    doLast {
        exec {
            commandLine("git", "push", "origin", "HEAD")
        }
    }
}

tasks.register("megamax") {
    description = "Compile, build jar, test, music"
    dependsOn("clean", "build", "test", "music", "report", "push")
}
