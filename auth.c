#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/file.h>
#include <time.h>
#include <fcntl.h>
#include <errno.h>
#include <limits.h>   // For PATH_MAX
#include <sys/stat.h> // For mkdir

// Define constants
#define MAX_BUFFER 4096
#define MAX_USERNAME_LEN 64
#define MAX_PASSWORD_LEN 256
#define MAX_LOGIN_ATTEMPTS 5
#define LOCKOUT_PERIOD 900  // 15 minutes in seconds
#define LOG_FILE "/var/log/webapp/login_attempts.log"
#define SESSION_DIR "/var/sessions"
#define TEMP_UPLOAD_DIR "/var/www/tmp"

// Function prototypes
void handle_login();
void handle_upload();
int check_brute_force(const char *username, const char *ip_address);
void log_login_attempt(const char *username, const char *ip_address, int success);
char* generate_session_id();
void create_session(const char *username);
char* scan_file(const char *filepath);
void send_json_response(const char *status, const char *message);
void parse_post_data();
char* url_decode(const char *str);
char* get_env_var(const char *name);
char* get_ip_address();

// Global variables to store form data
char username[MAX_USERNAME_LEN];
char password[MAX_PASSWORD_LEN];
char content_type[100];
char boundary[100];
char *post_data = NULL;
long content_length = 0;
#define DEBUG_LOG "/var/log/webapp/cgi_debug.log"

void debug_log(const char *msg) {
    FILE *f = fopen(DEBUG_LOG, "a");
    if (f) {
        time_t now = time(NULL);
        fprintf(f, "%s: %s\n", ctime(&now), msg);
        fclose(f);
    }
}

int main() {
    debug_log("CGI script started");
    char *request_method = getenv("REQUEST_METHOD");
    char *content_length_env = getenv("CONTENT_LENGTH");
    char *content_type_env = getenv("CONTENT_TYPE");

    char dbg[256];
    snprintf(dbg, sizeof(dbg), "Method: %s, Content-Length: %s, Content-Type: %s", request_method ? request_method : "NULL", content_length_env ? content_length_env : "NULL", content_type_env ? content_type_env : "NULL");
    debug_log(dbg);
    
    // We'll print the Content-Type header later when we know if we need to set cookies
    
    // Only process POST requests
    if (request_method == NULL || strcmp(request_method, "POST") != 0) {
        send_json_response("error", "Only POST method is allowed");
        return 1;
    }
    
    // Get content length
    if (content_length_env != NULL) {
        content_length = atol(content_length_env);
    } else {
        send_json_response("error", "No content length specified");
        return 1;
    }
    
    // Check for unreasonable content length
    if (content_length <= 0 || content_length > 1073741824) { // Max 1GB (1024MB)
        send_json_response("error", "Invalid content length");
        return 1;
    }
    
    // Get content type
    if (content_type_env != NULL) {
        strncpy(content_type, content_type_env, sizeof(content_type) - 1);
        content_type[sizeof(content_type) - 1] = '\0';
    } else {
        send_json_response("error", "No content type specified");
        return 1;
    }
    
    // Read POST data
    parse_post_data();
    
    // Debug log POST data
    char dbg_post[256];
    snprintf(dbg_post, sizeof(dbg_post), "POST data first 100 chars: %.100s", post_data);
    debug_log(dbg_post);
    
    // Determine which action to handle
    if (strstr(content_type, "multipart/form-data") != NULL) {
        handle_upload();
    } else if (strstr(post_data, "username=") != NULL && strstr(post_data, "password=") != NULL) {
        handle_login();
    } else {
        debug_log("No recognizable action in POST data");
        send_json_response("error", "Unknown action");
    }
    
    // Clean up
    if (post_data != NULL) {
        free(post_data);
    }
    
    return 0;
}

void parse_post_data() {
    // Log allocation size for debugging
    char allocation_log[100];
    snprintf(allocation_log, sizeof(allocation_log), "Allocating memory for POST data: %ld bytes", content_length + 1);
    debug_log(allocation_log);
    
    post_data = malloc(content_length + 1);
    if (post_data == NULL) {
        debug_log("Memory allocation failed for POST data");
        send_json_response("error", "Memory allocation failed");
        exit(1);
    }
    
    size_t bytes_read = 0;
    size_t bytes_to_read = content_length;
    
    while (bytes_to_read > 0) {
        size_t chunk = fread(post_data + bytes_read, 1, bytes_to_read, stdin);
        if (chunk == 0) break;
        bytes_read += chunk;
        bytes_to_read -= chunk;
    }
    
    post_data[bytes_read] = '\0';
    
    // For URL encoded form data, extract username and password
    if (strstr(content_type, "application/x-www-form-urlencoded") != NULL) {
        char *username_start = strstr(post_data, "username=");
        char *password_start = strstr(post_data, "password=");
        
        if (username_start != NULL) {
            username_start += 9; // Skip "username="
            char *end = strchr(username_start, '&');
            if (end != NULL) {
                *end = '\0';
                strncpy(username, username_start, MAX_USERNAME_LEN - 1);
                username[MAX_USERNAME_LEN - 1] = '\0';
                *end = '&'; // Restore the original character
            } else {
                strncpy(username, username_start, MAX_USERNAME_LEN - 1);
                username[MAX_USERNAME_LEN - 1] = '\0';
            }
            
            char *decoded_username = url_decode(username);
            if (decoded_username) {
                strncpy(username, decoded_username, MAX_USERNAME_LEN - 1);
                username[MAX_USERNAME_LEN - 1] = '\0';
                free(decoded_username);
            }
        }
        
        if (password_start != NULL) {
            password_start += 9; // Skip "password="
            char *end = strchr(password_start, '&');
            if (end != NULL) {
                *end = '\0';
                strncpy(password, password_start, MAX_PASSWORD_LEN - 1);
                password[MAX_PASSWORD_LEN - 1] = '\0';
                *end = '&'; // Restore the original character
            } else {
                strncpy(password, password_start, MAX_PASSWORD_LEN - 1);
                password[MAX_PASSWORD_LEN - 1] = '\0';
            }
            
            char *decoded_password = url_decode(password);
            if (decoded_password) {
                strncpy(password, decoded_password, MAX_PASSWORD_LEN - 1);
                password[MAX_PASSWORD_LEN - 1] = '\0';
                free(decoded_password);
            }
        }
    }
}

void handle_login() {
    debug_log("handle_login: called");
    
    char dbg[256];
    snprintf(dbg, sizeof(dbg), "Username: '%s', Password: '%s'", username, password);
    debug_log(dbg);
    
    // Get client IP address
    char *ip_address = get_ip_address();
    
    // Check for brute force attempts
    if (!check_brute_force(username, ip_address)) {
        printf("Content-Type: application/json\r\n\r\n"); // Send HTTP headers
        send_json_response("error", "Terlalu banyak upaya login. Silakan coba lagi nanti.");
        return;
    }
    
    // In a real system, validate against hashed passwords in a database
    // This is just a simplified example
    int login_success = (strcmp(username, "admin") == 0 && strcmp(password, "password123") == 0);
    
    // Log the login attempt
    log_login_attempt(username, ip_address, login_success);
    
    if (login_success) {
        // First output cookie header
        char *session_id = generate_session_id();
        if (session_id != NULL) {
            // Set session cookie BEFORE Content-Type header
            printf("Set-Cookie: session_id=%s; Path=/; HttpOnly; SameSite=Strict\r\n", session_id);
            
            // Then output content type header
            printf("Content-Type: application/json\r\n\r\n");
            
            // Save session to file
            char session_path[1024]; // Use fixed size instead of PATH_MAX
            snprintf(session_path, sizeof(session_path), "%s/%s", SESSION_DIR, session_id);
            
            FILE *session_file = fopen(session_path, "w");
            if (session_file) {
                fprintf(session_file, "username=%s\n", username);
                fprintf(session_file, "created=%ld\n", time(NULL));
                fprintf(session_file, "ip=%s\n", ip_address);
                fclose(session_file);
            }
            
            free(session_id);
            
            // Send response
            send_json_response("success", "Login berhasil! Selamat datang.");
        } else {
            printf("Content-Type: application/json\r\n\r\n"); // Send HTTP headers
            send_json_response("error", "Tidak dapat membuat sesi login.");
        }
    } else {
        printf("Content-Type: application/json\r\n\r\n"); // Send HTTP headers
        send_json_response("error", "Nama pengguna atau kata sandi salah.");
    }
}

void handle_upload() {
    // For a real implementation, you'd need a proper multipart/form-data parser
    // This is a simplified version that demonstrates the concept
    
    debug_log("handle_upload: called");
    
    // Send HTTP headers
    printf("Content-Type: application/json\r\n\r\n");
    // Extract boundary from content type
    char *boundary_start = strstr(content_type, "boundary=");
    if (boundary_start == NULL) {
        debug_log("handle_upload: No boundary found in content type");
        send_json_response("error", "No boundary found in content type");
        return;
    }
    boundary_start += 9; // Skip "boundary="
    snprintf(boundary, sizeof(boundary), "--%s", boundary_start);
    debug_log(boundary);
    
    // Create a temporary file with mkstemp
    char temp_path[1024]; // Fixed size instead of PATH_MAX
    snprintf(temp_path, sizeof(temp_path), "%s/scan-XXXXXX", TEMP_UPLOAD_DIR);
    
    int fd = mkstemp(temp_path);
    if (fd < 0) {
        debug_log("handle_upload: Failed to create temporary file");
        send_json_response("error", "Failed to create temporary file");
        return;
    }
    
    // Find the file data in the multipart form data
    // This is a very simplified approach
    char *file_start = strstr(post_data, "filename=");
    if (file_start == NULL) {
        debug_log("handle_upload: No file found in upload");
        close(fd);
        unlink(temp_path);
        send_json_response("error", "No file found in upload");
        return;
    }
    
    // Extract the filename for debugging
    char filename_debug[256] = {0};
    char *filename_start = file_start + 9; // Skip "filename="
    char *filename_end = strstr(filename_start, "\"");
    if (filename_start && filename_end && (filename_end - filename_start < 255)) {
        strncpy(filename_debug, filename_start + 1, filename_end - filename_start - 1); // Skip quotes
        filename_debug[filename_end - filename_start - 1] = '\0';
        char fileinfo[512];
        snprintf(fileinfo, sizeof(fileinfo), "Uploading file: %s", filename_debug);
        debug_log(fileinfo);
    }
    
    // Find the actual file content (after two newlines)
    char *content_start = strstr(file_start, "\r\n\r\n");
    if (content_start == NULL) {
        debug_log("handle_upload: File content not found");
        close(fd);
        unlink(temp_path);
        send_json_response("error", "File content not found");
        return;
    }
    content_start += 4; // Skip "\r\n\r\n"
    
    // Find the end boundary
    char end_boundary[150];
    snprintf(end_boundary, sizeof(end_boundary), "\r\n%s", boundary);
    
    // Debug the boundary string we're looking for
    char dbg_boundary[300];
    snprintf(dbg_boundary, sizeof(dbg_boundary), "Looking for boundary: %s", end_boundary);
    debug_log(dbg_boundary);
    
    // Find the end of file content (where the boundary starts again)
    char *content_end = NULL;
    char *search_pos = content_start;
    size_t bytes_left = content_length - (content_start - post_data);
    
    // We need to search for the boundary in chunks because memmem is not standard
    // and binary data may contain nulls
    while (search_pos < post_data + content_length - strlen(end_boundary)) {
        if (memcmp(search_pos, end_boundary, strlen(end_boundary)) == 0) {
            content_end = search_pos;
            break;
        }
        search_pos++;
    }
    
    if (content_end == NULL) {
        debug_log("handle_upload: End boundary not found");
        close(fd);
        unlink(temp_path);
        send_json_response("error", "File end boundary not found");
        return;
    }
    
    // Calculate file size and write to file
    size_t file_size = content_end - content_start;
    char size_info[100];
    snprintf(size_info, sizeof(size_info), "File size: %zu bytes", file_size);
    debug_log(size_info);
    
    // Write the content to file
    ssize_t bytes_written = write(fd, content_start, file_size);
    if (bytes_written < 0) {
        debug_log("handle_upload: Failed to write file");
        close(fd);
        unlink(temp_path);
        send_json_response("error", "Failed to write file");
        return;
    }
    
    close(fd);
    
    char dbg_path[256];
    snprintf(dbg_path, sizeof(dbg_path), "File extracted to: %s", temp_path);
    debug_log(dbg_path);
    
    // Scan the file with our scanner that can handle zip files
    char *scan_result = scan_file(temp_path);
    
    // Send the result
    printf("%s", scan_result);
    
    // Clean up
    free(scan_result);
    unlink(temp_path); // Always delete the temporary file
}

int check_brute_force(const char *username, const char *ip_address) {
    FILE *log_file;
    char line[256];
    time_t current_time = time(NULL);
    int failed_attempts = 0;
    
    // Open log file for reading
    log_file = fopen(LOG_FILE, "r");
    if (log_file == NULL) {
        // If the file doesn't exist, there are no previous attempts
        return 1;
    }
    
    // Lock the file to prevent concurrent access
    if (flock(fileno(log_file), LOCK_SH) < 0) {
        fclose(log_file);
        return 1; // Allow login if we can't get a lock
    }
    
    // Count failed attempts within lockout period
    while (fgets(line, sizeof(line), log_file) != NULL) {
        char log_time_str[32], log_username[MAX_USERNAME_LEN], log_ip[46], log_status[10];
        time_t log_time;
        
        // Parse log line (format: timestamp|username|ip_address|status)
        if (sscanf(line, "%[^|]|%[^|]|%[^|]|%s", log_time_str, log_username, log_ip, log_status) == 4) {
            log_time = atol(log_time_str);
            
            // Count only recent failures for this username or IP
            if ((current_time - log_time) < LOCKOUT_PERIOD && 
                (strcmp(log_status, "FAILURE") == 0) && 
                (strcmp(log_username, username) == 0 || strcmp(log_ip, ip_address) == 0)) {
                failed_attempts++;
            }
        }
    }
    
    // Release lock and close file
    flock(fileno(log_file), LOCK_UN);
    fclose(log_file);
    
    // Check if too many failed attempts
    return (failed_attempts < MAX_LOGIN_ATTEMPTS);
}

void log_login_attempt(const char *username, const char *ip_address, int success) {
    FILE *log_file;
    
    // Open log file for appending
    log_file = fopen(LOG_FILE, "a");
    if (log_file == NULL) {
        // Try to create the directory if it doesn't exist
        char dir_path[256];
        snprintf(dir_path, sizeof(dir_path), "/var/log/webapp");
        mkdir(dir_path, 0755);
        
        // Try again
        log_file = fopen(LOG_FILE, "a");
        if (log_file == NULL) {
            return; // Can't log
        }
    }
    
    // Lock the file to prevent concurrent writes
    if (flock(fileno(log_file), LOCK_EX) < 0) {
        fclose(log_file);
        return;
    }
    
    // Write log entry
    fprintf(log_file, "%ld|%s|%s|%s\n", 
            time(NULL), 
            username, 
            ip_address, 
            success ? "SUCCESS" : "FAILURE");
    
    // Flush to disk, unlock, and close
    fflush(log_file);
    flock(fileno(log_file), LOCK_UN);
    fclose(log_file);
}

char* generate_session_id() {
    unsigned char random_data[32];
    char *session_id = malloc(65); // 32 bytes = 64 hex chars + null
    
    if (session_id == NULL) {
        return NULL;
    }
    
    // Open /dev/urandom for cryptographically secure random data
    int urandom_fd = open("/dev/urandom", O_RDONLY);
    if (urandom_fd < 0) {
        free(session_id);
        return NULL;
    }
    
    // Read random data
    if (read(urandom_fd, random_data, sizeof(random_data)) != sizeof(random_data)) {
        close(urandom_fd);
        free(session_id);
        return NULL;
    }
    
    close(urandom_fd);
    
    // Convert to hex string
    for (int i = 0; i < 32; i++) {
        sprintf(session_id + (i * 2), "%02x", random_data[i]);
    }
    
    return session_id;
}

// This function is now replaced with inline code in handle_login
void create_session(const char *username) {
    // Function kept for reference, but no longer used
}

char* scan_file(const char *filepath) {
    char command[512];
    char buffer[4096];
    char *result_json = malloc(4096); // Allocate memory for response
    FILE *pipe;
    int found_virus = 0;
    int is_archive = 0;
    char file_type[256] = "";
    
    debug_log("scan_file: Starting scan");
    
    if (result_json == NULL) {
        return strdup("{\"status\":\"error\",\"message\":\"Memory allocation failed\"}");
    }
    
    // First, check if file is a zip archive
    snprintf(command, sizeof(command), "file -b '%s'", filepath);
    pipe = popen(command, "r");
    if (pipe) {
        if (fgets(file_type, sizeof(file_type), pipe)) {
            debug_log(file_type);
            if (strstr(file_type, "Zip archive") || strstr(file_type, "zip archive")) {
                is_archive = 1;
                debug_log("scan_file: File is a zip archive");
            }
        }
        pclose(pipe);
    }
    
    // Build ClamAV command with options to scan inside archives
    if (is_archive) {
        snprintf(command, sizeof(command), 
                "clamscan --infected --no-summary --recursive=yes --archive-verbose '%s'", 
                filepath);
        debug_log("scan_file: Using recursive archive scanning");
    } else {
        snprintf(command, sizeof(command), 
                "clamscan --infected --no-summary '%s'", 
                filepath);
    }
    
    debug_log(command);
    
    // Use popen to execute command and read its output
    pipe = popen(command, "r");
    if (!pipe) {
        sprintf(result_json, "{\"status\":\"error\",\"message\":\"Failed to run virus scanner\"}");
        return result_json;
    }
    
    // Clear buffer and prepare for results
    memset(buffer, 0, sizeof(buffer));
    
    // Read all output lines and collect results
    while (fgets(buffer, sizeof(buffer) - 1, pipe) != NULL) {
        debug_log(buffer);
        if (strstr(buffer, "FOUND")) {
            found_virus = 1;
        }
    }
    
    // Check the return code
    int status = pclose(pipe);
    int exit_code = 0;
    
    if (WIFEXITED(status)) {
        exit_code = WEXITSTATUS(status);
        char exit_info[50];
        snprintf(exit_info, sizeof(exit_info), "scan_file: ClamAV exit code: %d", exit_code);
        debug_log(exit_info);
    }
    
    if (found_virus || exit_code == 1) {
        // ClamAV found infections
        if (is_archive) {
            sprintf(result_json, "{\"status\":\"infected\",\"message\":\"File ZIP mengandung malware\"}");
        } else {
            sprintf(result_json, "{\"status\":\"infected\",\"message\":\"File terinfeksi malware\"}");
        }
    } else if (exit_code == 2) {
        // ClamAV error
        sprintf(result_json, "{\"status\":\"error\",\"message\":\"Error saat memindai file\"}");
    } else {
        // File is clean
        if (is_archive) {
            sprintf(result_json, "{\"status\":\"clean\",\"message\":\"Semua file dalam ZIP bersih dari malware\"}");
        } else {
            sprintf(result_json, "{\"status\":\"clean\",\"message\":\"File bersih dari malware\"}");
        }
    }
    
    return result_json;
}

void send_json_response(const char *status, const char *message) {
    // Make sure we've already sent Content-Type header
    // We don't need to re-send it as it's done in main()
    printf("{\"status\":\"%s\",\"message\":\"%s\"}", status, message);
}

char* url_decode(const char *str) {
    if(str == NULL) return NULL;
    
    char *decoded = malloc(strlen(str) + 1);
    if(decoded == NULL) return NULL;
    
    char *p_decoded = decoded;
    
    while(*str) {
        if(*str == '%' && *(str+1) && *(str+2)) {
            // Convert hex to character
            char hex[3] = {*(str+1), *(str+2), '\0'};
            *p_decoded++ = (char)strtol(hex, NULL, 16);
            str += 3;
        } else if(*str == '+') {
            *p_decoded++ = ' ';
            str++;
        } else {
            *p_decoded++ = *str++;
        }
    }
    
    *p_decoded = '\0';
    return decoded;
}

char* get_env_var(const char *name) {
    char *value = getenv(name);
    return value ? value : "";
}

char* get_ip_address() {
    // Try different environment variables to get the client IP
    char *ip = getenv("HTTP_X_FORWARDED_FOR");
    if (!ip || !*ip) {
        ip = getenv("REMOTE_ADDR");
    }
    return ip ? ip : "unknown";
}