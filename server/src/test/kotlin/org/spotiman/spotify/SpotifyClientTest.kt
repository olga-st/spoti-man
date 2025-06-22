package org.spotiman.spotify

import org.flywaydb.core.internal.util.UrlUtils
import org.junit.jupiter.api.Test

class SpotifyClientTest {

    private val spotifyClient = SpotifyClient()

//    @Test
    fun test() {

        val authorizeResponse = spotifyClient.authorize()
        val location = authorizeResponse.headers.get("location")?.first()!!
        val next = location.substringAfter("?continue=")
        val decoded = UrlUtils.decodeURLSafe(next)
        println(decoded)
    }

//    @Test
    fun test2() {
        val code =
            "AQBCf-k0Eft2FrjYdUpZEectUH6loC5SSerIRoriISv6wtZuZV1IKIjVU-u90ZljfpfB6bnxKzCLjeL7JUxeXPoh60E60omN5i0qwZNIpKSEcQv_upyeLzhGUZ6Pd5nWqAUKe9RKL8ZQkchJlPOvzHoY3XeMpUu4QFcIpDO8DDpzGQ"
        val token = spotifyClient.token(code)
        println(token)
    }

}