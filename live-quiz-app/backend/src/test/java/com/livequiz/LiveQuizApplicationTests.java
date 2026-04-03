package com.livequiz;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Basic Spring Boot context load test.
 * This verifies the application context starts up correctly
 * (all beans wired, no config errors).
 *
 * Run with: mvn test
 * Or in IntelliJ: right-click > Run 'LiveQuizApplicationTests'
 */
@SpringBootTest
@ActiveProfiles("test")
class LiveQuizApplicationTests {

    @Test
    void contextLoads() {
        // If this test passes, the entire Spring context loaded successfully:
        // - All @Beans were created
        // - All @Autowired dependencies were injected
        // - application.properties was loaded
    }
}
