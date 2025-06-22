package org.spotiman.repository

import org.springframework.stereotype.Repository

@Repository
class TestRepositoryMock : TestRepository {
    override fun test(): String {
        return "Hello TestRepositoryMock"
    }
}