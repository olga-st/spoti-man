package org.spotiman.http

import org.spotiman.spotify.SpotifyClient
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.view.RedirectView

@RestController
class AuthController(private val spotifyClient: SpotifyClient) {

    @GetMapping(
        value = ["/login"],
    )
    fun login(): RedirectView {
//        val uriString = spotifyClient.getAuthorizeUri()
        val authorize = spotifyClient.authorize()
        println("login: responded with $authorize")
        val location = authorize.headers.location ?: throw RuntimeException("Location is empty")
        return RedirectView(location.toString())
//        return RedirectView(uriString)
    }

    @PostMapping(
        value = ["/token"],
        produces = ["application/json"]
    )
    fun token(@RequestBody req: TokenRequest): ResponseEntity<AccessToken> {
        val response = spotifyClient.token(req.code)
        println("token: responded with $response")
        return ResponseEntity.ok().body(AccessToken(response.access_token))
    }
}

data class TokenRequest(
    val code: String
)

data class AccessToken(
    val accessToken: String
)