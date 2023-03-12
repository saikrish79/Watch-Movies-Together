package com.flow.LetzWMT.config;

import com.flow.LetzWMT.controller.SocketController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class SocketConfiguration implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(socketController(), "/socket")
                .setAllowedOrigins("http://localhost:3000").withSockJS();
    }

    @Bean
    SocketController socketController(){
        return new SocketController();
    }
}
