package org.spotiman.spotify

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Service
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.DefaultResponseErrorHandler
import org.springframework.web.client.RestClient
import org.springframework.web.util.UriComponentsBuilder
import java.util.*


val client_id = "2b3a80a7b7284b40b85867c2fb4373a7"
val client_secret = "f6d100f7574d430fb295da067d098214"
val redirect_uri = "http://127.0.0.1:5173/callback"

//val scopes = arrayOf(
//    "playlist-read-private",
//    "playlist-modify-public",
//    "playlist-modify-private",
//).joinToString(separator = " ")
val scopes = "playlist-read-private playlist-modify-public playlist-modify-private"
private const val SPOTIFY_AUTH_BASE_URL = "https://accounts.spotify.com/"

@Service
class SpotifyClient() {

    private val restClient: RestClient = RestClient.builder()
        .baseUrl(SPOTIFY_AUTH_BASE_URL)
        .build()

    fun getAuthorizeUri(): String {
        val state = randomString(8)
        return UriComponentsBuilder
            .fromUriString("authorize")
            .queryParam("response_type", "code")
            .queryParam("client_id", client_id)
            .queryParam("scope", scopes)
            .queryParam("redirect_uri", redirect_uri)
            .queryParam("state", state)
            .queryParam("show_dialog", false)
            .build()
            .toUriString()

    }

    fun authorize(): ResponseEntity<String> {
        return restClient.get().uri(getAuthorizeUri())
            .retrieve()
            .toEntity(String::class.java)
    }

    fun token(code: String): SpotifyTokenResponse {
        val body = restClient.post()
            .uri("api/token")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(
                LinkedMultiValueMap(
                    mapOf(
                        "code" to listOf(code),
                        "redirect_uri" to listOf(redirect_uri),
                        "grant_type" to listOf("authorization_code")
                    )
                )
            )
            .header("Authorization", "Basic " + encode("$client_id:$client_secret"))
            .retrieve()
            .onStatus(DefaultResponseErrorHandler())
            .body(SpotifyTokenResponse::class.java)

        if (body == null) {
            throw RuntimeException("Response is null for token request")
        }
        return body
    }

    private fun encode(string: String): String {
        return Base64.getEncoder().encodeToString(string.toByteArray(Charsets.UTF_8))
    }

    private fun randomString(length: Int): String {
        val alphabet: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        return List(length) { alphabet.random() }.joinToString("")
    }
}

data class SpotifyTokenResponse(
    val access_token: String,
    val token_type: String,//	How the access token may be used: always "Bearer".
    val scope: String?,//	A space-separated list of scopes which have been granted for this access_token
    val expires_in: Int,//	The time period (in seconds) for which the access token is valid.
    val refresh_token: String
)

data class SpotifyTokenRequest(
    val code: String,
    val redirect_uri: String,
    val grant_type: String
)
