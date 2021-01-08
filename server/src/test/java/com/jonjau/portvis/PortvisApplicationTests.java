package com.jonjau.portvis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;


@SpringBootTest(classes = PortvisApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PortvisApplicationTests {

    // template for use in forming REST API requests. Convert to WebClient for future-proofing.
    private final TestRestTemplate restTemplate;

    @Autowired
    public PortvisApplicationTests(TestRestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @LocalServerPort
    private int port;

    private String getPort() { return Integer.toString(port); }

    private String getRootUrl() {
        return "http://localhost:" + port;
    }

//    @Test
//    void contextLoads() {
//        // "does the application context load without errors?"
//    }
}

