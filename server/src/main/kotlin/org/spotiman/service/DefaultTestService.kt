package org.spotiman.service

import org.spotiman.repository.TestRepository
import org.springframework.stereotype.Service

@Service
class DefaultTestService(private val testRepository: TestRepository) : TestService {
    override fun test(): String {
        return testRepository.test()
    }
}