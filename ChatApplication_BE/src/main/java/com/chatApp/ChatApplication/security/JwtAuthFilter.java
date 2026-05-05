package com.chatApp.ChatApplication.security;

import com.chatApp.ChatApplication.entity.User;
import com.chatApp.ChatApplication.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    private HandlerExceptionResolver handlerExceptionResolver;

    @Autowired
    private AuthUtil authUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            log.info("USER REQUEST : "+request.getRequestURI());
            String AuthToken = request.getHeader("Authorization");
            log.info("AuthToken : "+AuthToken);
            if(AuthToken==null ||!AuthToken.startsWith("Bearer ")){
                filterChain.doFilter(request,response);
                return;
            }
            String token=AuthToken.substring(7);
            String username=authUtil.getUsernameFromToken(token);
            if(username!=null && SecurityContextHolder.getContext().getAuthentication()==null){
                User user=userRepository.findByUsername(username).orElseThrow();
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken=new UsernamePasswordAuthenticationToken(user,null,user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
            filterChain.doFilter(request,response);
        } catch (Exception ex) {
            handlerExceptionResolver.resolveException(request,response,null,ex);
        }
    }
}
