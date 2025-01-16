local http_server = require("http.server")
local http_headers = require("http.headers")
local config = require("config.config")
local logger = require("utils.logger")
local ConversationFlow = require("modules.conversation_flow")
local ErrorHandler = require("modules.error_handler")

-- Load environment variables
local function load_environment()
    logger.info("Loading environment configurations...")
    local env_file = io.open(".env", "r")
    if env_file then
        for line in env_file:lines() do
            for k, v in string.gmatch(line, "(%w+)=([%w%p]+)") do
                os.setenv(k, v)
            end
        end
        env_file:close()
    else
        logger.error(".env file not found")
    end
end

-- Initialize server
local function start_server()
    local server = http_server.listen {
        host = config.server_host,
        port = config.server_port,
        onstream = function(server, stream)
            local headers = stream:get_headers()
            local method = headers:get(":method")
            local path = headers:get(":path")

            if method == "POST" and path == "/chat" then
                local body = stream:get_body_as_string()
                local user_input = json.decode(body).input
                local user_id = json.decode(body).user_id

                local response_text = ErrorHandler.safe_call(ConversationFlow.process_input, user_id, user_input)
                if response_text then
                    local response_headers = http_headers.new()
                    response_headers:append(":status", "200")
                    response_headers:append("content-type", "application/json")
                    stream:write_headers(response_headers, false)
                    stream:write_chunk(json.encode({ response = response_text }), true)
                else
                    local response_headers = http_headers.new()
                    response_headers:append(":status", "500")
                    response_headers:append("content-type", "application/json")
                    stream:write_headers(response_headers, false)
                    stream:write_chunk(json.encode({ error = "Internal Server Error" }), true)
                end
            else
                local response_headers = http_headers.new()
                response_headers:append(":status", "404")
                response_headers:append("content-type", "application/json")
                stream:write_headers(response_headers, false)
                stream:write_chunk(json.encode({ error = "Not Found" }), true)
            end
        end,
        onerror = function(server, context, op, err, errno)
            logger.error(string.format("HTTP server error: %s on %s: %s", op, context, err))
        end
    }

    assert(server:listen())
    logger.info("Server started at " .. config.server_host .. ":" .. config.server_port)
    server:loop()
end

-- Main function
local function main()
    load_environment()
    start_server()
end

main()
