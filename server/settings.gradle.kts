pluginManagement {
    plugins {
        val kotlinVersion = "2.1.21"
        kotlin("jvm") version kotlinVersion
        kotlin("plugin.spring") version kotlinVersion
        id("org.springframework.boot") version "3.5.0"
        id("org.flywaydb.flyway") version "11.9.1"
        id("org.jooq.jooq-codegen-gradle") version "3.20.5"
    }

    repositories {
        mavenCentral()
        mavenLocal()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {

    repositories {
        mavenCentral()
        mavenLocal()
    }
}

rootProject.name = "spoti-man"