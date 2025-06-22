package org.spotiman.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig {

    @Bean
    fun corsConfigurer(): WebMvcConfigurer {
        return object : WebMvcConfigurer {
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/**") // This applies to all endpoints
                    // You need to replace this with your client's actual origin
                    .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                    .allowedMethods("GET", "POST", "OPTIONS")
                    .allowedHeaders("*")
            }
        }
    }
}