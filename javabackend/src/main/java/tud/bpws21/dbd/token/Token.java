package tud.bpws21.dbd.token;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import tud.bpws21.dbd.config.Config;
import java.util.Date;

public class Token {
    public static String generate(long id, String username) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(Config.TOKEN_SECRET);
            String token = JWT.create()
                    .withIssuer(Config.TOKEN_ISSUE)
                    .withClaim("id", id)
                    .withClaim("username", username)
                    .withExpiresAt(new Date(System.currentTimeMillis() + 1000*60*60*4))
                    .sign(algorithm);
            return token;
        } catch (JWTCreationException exception){
            return null;
        }
    }

    public static boolean verify(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(Config.TOKEN_SECRET);
            JWTVerifier verifier = JWT.require(algorithm)
                    .withIssuer(Config.TOKEN_ISSUE)
                    .build();
            DecodedJWT jwt = verifier.verify(token);
            return jwt.getExpiresAt().compareTo(new Date(System.currentTimeMillis())) > 0;
        } catch (JWTVerificationException exception){
            return false;
        }
    }
}
