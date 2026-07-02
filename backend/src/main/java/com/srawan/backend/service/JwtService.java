package com.srawan.backend.service;

import org.springframework.stereotype.Service;

import java.util.Date;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import io.jsonwebtoken.JwtException;

@Service
public class JwtService {
@Value("${jwt.secret}")
  private String secretKey;

  @Value("${jwt.expiration}")
    private long expirationTime;

    public String generateToken(String email){
        Key key= Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder().setSubject(email)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis()+expirationTime))
            .signWith( key, SignatureAlgorithm.HS256)
            .compact();
        }

        public String extractEmail(String token){
            return extractAllClaims(token).getSubject();
        }

        private Claims extractAllClaims(String token){
            Key key=Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));

            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        }

        public boolean isTokenValid(String token){
            try{
                extractAllClaims(token);
                return true;

            }catch(JwtException | IllegalArgumentException e){
                return false;
            }
        }


    }

