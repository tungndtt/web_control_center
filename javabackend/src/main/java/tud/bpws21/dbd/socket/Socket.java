package tud.bpws21.dbd.socket;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import info.dornbach.dbdclient.DBDClient;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;
import tud.bpws21.dbd.config.Config;
import tud.bpws21.dbd.token.Token;
import javax.annotation.PostConstruct;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;

@Component
// WebSocket-based connection between "frontend application" <----> "backend server" <----> "DBD server"
public class Socket {

    private static Logger logger = Logger.getLogger(Socket.class);

    static SocketIOServer serverSocket;
    static DBDClient dbdclient;

    @PostConstruct
    public static void init()  {
        try {
            // establish the socket connection between "backend server" and "frontend application"
            Configuration config = new Configuration();
            config.setHostname(Config.SOCKET_HOST);
            config.setPort(Config.SOCKET_PORT);
            serverSocket = new SocketIOServer(config);
            serverSocket.start();
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                serverSocket.stop();
            }));

            // establish the socket connection between "DBD server" and "backend server"
            if(Config.DBD_CONNECT) {
                dbdclient = new DBDClient();
                dbdclient.connect(Config.DBD_URL, Config.DBD_PORT);
                Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                    dbdclient.disconnect();
                }));
            }

            // Event Handlers
            Class[] handlers = new Class[] {
                LoadPageDataHandler.class, // handler for initializing the data
                PageEventHandler.class, // handler for events from pages
                UtilsHandler.class // handler for others
            };

            for(Class handler : handlers) {
                for(Method method : handler.getMethods()) {
                    if(method.getDeclaringClass() == handler) {
                        // invoke method of handler
                        method.invoke(null);
                    }
                }
            }
        } catch(Exception e) {
            logger.error(e.getMessage());
        }
    }

    // wrap up the add-event listeners by middleware function, which checks for the token validation
    static <T> void addEventListener(String eventName, Action<T> action) {
        serverSocket.addEventListener(eventName, Object.class, (client, data, ackRequest) -> {
            try {
                HashMap<String, Object> dataMap = (HashMap<String, Object>) data;
                String token = (String) dataMap.get("token");
                if(Token.verify(token)) {
                    action.execute(client, (T) dataMap.get("data"));
                } else {
                    serverSocket.getClient(client.getSessionId()).sendEvent("disconnect", "Token invalid");
                    client.disconnect();
                }
            } catch(Exception e) {
                logger.error(e.getMessage(), e);
                serverSocket.getClient(client.getSessionId()).sendEvent("disconnect", e.getMessage());
                client.disconnect();
            }
        });
    }

    // broadcast to all users
    static void broadcast(String event, Object... data) {
        Object sendData = data.length == 1? data[0] : Arrays.asList(data);
        for(SocketIOClient client : Socket.serverSocket.getAllClients()) {
            client.sendEvent(event, sendData);
        }
    }

    // action to be executed inside the handler methods if the token is valid
    interface Action<T> {
        void execute(SocketIOClient client, T data) throws IOException;
    }
}