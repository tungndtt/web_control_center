package tud.bpws21.dbd.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

@Configuration
@ConfigurationProperties
public class Config {

    public static String SOCKET_HOST;
    @Value("${SOCKET_HOST}")
    public void setSocketHost(String socketHost) {
        SOCKET_HOST = socketHost;
    }

    public static int SOCKET_PORT;
    @Value("${SOCKET_PORT}")
    public void setSocketPort(int socketPort) {
        SOCKET_PORT = socketPort;
    }

    public static String TOKEN_SECRET;
    @Value("${TOKEN_SECRET}")
    public void setSocketSecret(String socketSecret) {
        TOKEN_SECRET = socketSecret;
    }

    public static String TOKEN_ISSUE;
    @Value("${TOKEN_ISSUE}")
    public void setSocketIssue(String socketIssue) {
        TOKEN_ISSUE = socketIssue;
    }

    public static String USERS_CONFIG_FILE;
    @Value("${USERS_CONFIG_FILE}")
    public void setUsersConfigFile(String usersConfigFile) {
        USERS_CONFIG_FILE = ResolvePath(usersConfigFile);
    }

    public static String CONTROL_CONFIG_FILE;
    @Value("${CONTROL_CONFIG_FILE}")
    public void setControlConfigFile(String controlConfigFile) {
        CONTROL_CONFIG_FILE = ResolvePath(controlConfigFile);
    }

    public static String CONTROL_PROFILE_DIR;
    @Value("${CONTROL_PROFILE_DIR}")
    public void setControlProfileDir(String controlProfileDir) {CONTROL_PROFILE_DIR = ResolvePath(controlProfileDir); }

    public static String DBD_URL;
    @Value("${DBD_URL}")
    public void setDbdUrl(String dbdUrl) {
        DBD_URL = dbdUrl;
    }

    public static int DBD_PORT;
    @Value("${DBD_PORT}")
    public void setDbdPort(int dbdPort) {
        DBD_PORT = dbdPort;
    }

    public static boolean DBD_CONNECT;
    @Value("${DBD_CONNECT}")
    public void setDbdConnect(boolean dbdConnect) {
        DBD_CONNECT = dbdConnect;
    }

    public static ControlConfiguration controlConfiguration;
    @PostConstruct
    public void setControlConfiguration() throws IOException {
        if(controlConfiguration == null) {
            controlConfiguration = ControlConfiguration.generate();
        }
    }

    public static List<ControlProfile> controlProfiles;
    @PostConstruct
    public void setControlProfiles() throws FileNotFoundException {
        if(controlProfiles == null) {
            controlProfiles = ControlProfile.generate();
        }
    }

    private static String ResolvePath(String path){
        return "classpath:" + path;
    }
}
