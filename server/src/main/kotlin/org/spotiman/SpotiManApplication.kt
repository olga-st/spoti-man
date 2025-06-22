package org.spotiman

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class SpotiManApplication

fun main(args: Array<String>) {
    runApplication<SpotiManApplication>(*args)
}