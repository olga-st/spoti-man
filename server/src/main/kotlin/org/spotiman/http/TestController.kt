package org.spotiman.http

import org.spotiman.service.TestService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController

@RestController
class TestController(private val testService: TestService) {

    @GetMapping(
        value = ["/test"],
        produces = ["application/json"]
    )
    fun test(): ResponseEntity<TestResult> {
        val value = testService.test()
        return ResponseEntity.ok(TestResult(value))
    }
}

data class TestResult(val value: String)