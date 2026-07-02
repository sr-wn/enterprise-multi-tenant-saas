package com.srawan.backend.Filter;

import com.srawan.backend.service.CustomUserDetailsService;
import com.srawan.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;


@Component
public class JwtFilter extends OncePerRequestFilter{
    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtFilter(JwtService jwtService,
                 CustomUserDetailsService customUserDetailsService) {

    this.jwtService=jwtService;
   this.customUserDetailsService=customUserDetailsService;
                 }
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {

    System.out.println("\n========== JWT FILTER EXECUTED ==========");

    final String authorizationHeader = request.getHeader("Authorization");

    System.out.println("Authorization Header: " + authorizationHeader);

    String email = null;
    String jwt = null;

    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {

        jwt = authorizationHeader.substring(7);

        System.out.println("JWT Token: " + jwt);

        try {
            email = jwtService.extractEmail(jwt);
            System.out.println("Extracted Email: " + email);
        } catch (Exception e) {
            System.out.println("Error extracting email: " + e.getMessage());
        }
    } else {
        System.out.println("No Bearer Token Found");
    }

    if (email != null &&
            SecurityContextHolder.getContext().getAuthentication() == null) {

        System.out.println("Loading User...");

        UserDetails userDetails =
                customUserDetailsService.loadUserByUsername(email);

        System.out.println("User Loaded: " + userDetails.getUsername());

        boolean valid = jwtService.isTokenValid(jwt);

        System.out.println("Token Valid: " + valid);

        if (valid) {

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request));

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            System.out.println("Authentication stored in SecurityContext");
        } else {
            System.out.println("Token is INVALID");
        }
    } else {

        System.out.println("Email is null OR User already authenticated");
    }

    System.out.println("Continuing Filter Chain...");
    System.out.println("=========================================\n");

    filterChain.doFilter(request, response);
}
    
}
