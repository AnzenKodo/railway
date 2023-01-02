package railway;

import java.io.*;
import java.net.*;
import java.awt.*;
import java.sql.*;
import javax.activation.FileTypeMap;

public class App {
    // Set the port number
    static final int port = 8080;
    static final File WEB_ROOT = new File("./src/website");
    static final File TEMPL_ROOT = new File("./src/template");

    public static void main(String[] args) throws IOException, URISyntaxException, SQLException {
        Connection conn = DB();
        // Load the database file into the in-memory database
        Statement stmt = conn.createStatement();
        stmt.execute("RESTORE FROM 'database.db'");

        // Execute the SELECT statement and get the result set
        ResultSet rs = stmt.executeQuery("SELECT * FROM users");

        // Iterate over the result set and print the rows
        while (rs.next()) {
            int id = rs.getInt("id");
            String name = rs.getString("name");
            String email = rs.getString("email");
            System.out.println("id: " + id + ", name: " + name + ", email: " + email);
        }

        // Create a backup of the in-memory database
        stmt.execute("BACKUP TO 'database.db'");

        // Close the connection
        conn.close();

        // website();
    }

    private static Connection DB() {
        try {
            // Load the SQLite JDBC driver
            Class.forName("org.sqlite.JDBC");

            // Connect to the in-memory database
            return DriverManager.getConnection("jdbc:sqlite::memory:");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static void website() throws IOException, URISyntaxException {
        // Create a new ServerSocket object to listen for incoming requests
        ServerSocket serverSocket = new ServerSocket(port);
        System.out.println("Web server listening on port " + port);

        // Open the default web browser and navigate to the server's URL
        if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
            Desktop desktop = Desktop.getDesktop();
            URI url = new URI("https://localhost:" + port);
            desktop.browse(url);
        }

        // Listen for incoming requests indefinitely
        while (true) {
            // Accept the incoming request and create a new socket for the connection
            Socket clientSocket = serverSocket.accept();
            PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);

            // Get the input and output streams for the socket
            BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));

            // Read the incoming HTTP request
            String request = in.readLine();
            System.out.println("Received request: " + request);

            // Check if the request is a "Connection: close" request
            if (request.startsWith("Connection: close")) {
                // If it is, close the server
                System.out.println("Closing server...");
                serverSocket.close();
                break;
            }

            // Parse the request to get the requested file path
            String[] parse = request.split(" ");
            String method = parse[0];
            String filePath = parse[1];

            // Set the default file path to "index.html"
            if (filePath.equals("/")) {
                filePath = "/index.html";
            }

            // Read the file from the local file system
            File file = new File(WEB_ROOT, filePath);
            String content = "<h1>404 Page Not Found</h1>";
            String contentType = "text/html";

            // If the file doesn't exist, use the "404.html" file instead
            // we support only GET and HEAD methods, we check

            if (file.exists()) {
                // Determine the content type based on the file extension
                FileTypeMap fileTypeMap = FileTypeMap.getDefaultFileTypeMap();
                contentType = fileTypeMap.getContentType(file);

                if (contentType.equals("text/html")) {
                    content = ReadTempl("head.html") + ReadTempl("header.html") + ReadContent(file)
                            + ReadTempl("footer.html");
                } else {
                    content = ReadContent(file);
                }
            }

            // Send the HTTP response
            if (method.equals("GET")) {
                out.println("HTTP/1.1 200 OK");
                out.println("Content-Type: " + contentType);
                out.println(""); // blank line between headers and content
                out.println(content);
                out.flush();
            }

            // Close the socket
            clientSocket.close();
        }
    }

    private static String ReadTempl(String filePath) throws IOException {
        File file = new File(TEMPL_ROOT, filePath);

        if (!file.exists()) {
            System.out.println("\n `" + filePath + "` not found in Template folder.\n");
            return "";
        }

        return ReadContent(file);
    }

    private static String ReadContent(File file) throws IOException {
        BufferedReader fileIn = new BufferedReader(new FileReader(file));
        String line;

        String content = "";
        while ((line = fileIn.readLine()) != null) {
            content += line + "\n";
        }

        fileIn.close();
        return content;
    }
}