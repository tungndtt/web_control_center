package tud.bpws21.dbd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import tud.bpws21.dbd.config.Config;

@SpringBootApplication
@EnableConfigurationProperties(Config.class)
public class WebControlCenterApplication {
	public static void main(String[] args) {
		SpringApplication.run(WebControlCenterApplication.class, args);
	}
}
