import org.jetbrains.kotlin.gradle.dsl.JvmTarget
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
import org.springframework.boot.gradle.plugin.SpringBootPlugin

plugins {
    kotlin("jvm")
    kotlin("plugin.spring")
    id("org.springframework.boot")
    id("org.jooq.jooq-codegen-gradle")
    idea
}
object Versions {
    val jooq = "3.20.5"
    val postgres = "42.7.7"
}

jooq {
    configuration {
        jdbc {
            driver = "org.postgresql.Driver"
            url = property("db.url") as String
            user = property("db.username") as String
            password = property("db.password") as String
        }
        generator {
            database {
                name = "org.jooq.meta.postgres.PostgresDatabase"
                includes = ".*" // A regex to include all tables/views/etc.
                inputSchema = "public" // The main schema to generate from
            }
            target {
                packageName = "org.spotiman.db.jooq" // <-- CHANGE THIS to your project's package
                directory = "generated-sources/jooq"
            }
            generate {
                isRecords = true         // Generate table Record classes
                isPojos = false           // Generate Plain Old Kotlin Objects (POKOs)
            }
        }
    }
}

sourceSets {
    main {
        java {
            srcDir(layout.buildDirectory.dir("generated-sources/jooq"))
        }
    }
}


dependencies {
    implementation(kotlin("stdlib"))
    implementation(platform(SpringBootPlugin.BOM_COORDINATES))
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-jooq")
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    implementation("org.jooq:jooq:${Versions.jooq}")

    runtimeOnly("org.postgresql:postgresql:${Versions.postgres}")

    jooqCodegen("org.postgresql:postgresql:${Versions.postgres}")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.test {
    useJUnitPlatform()
}

java.sourceCompatibility = JavaVersion.VERSION_21

tasks.withType<KotlinCompile>().configureEach {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_21)
    }
    dependsOn(tasks.named("jooqCodegen"))
}

tasks.named("jooqCodegen") {
    inputs.files(fileTree("src/main/resources/db/migration"))
}