local http = require("http.client")
local json = require("dkjson")
local ErrorHandler = require("modules.error_handler")

local HttpClient = {}

-- Function to make a GET request
-- @param url: the URL to send the request to
-- @param headers: optional table of headers to include in the request
-- @return: response body as a table, or nil and error message
function HttpClient.get(url, headers)
    local response, err = http.request("GET", url, nil, { headers = headers })
    if not response then
        ErrorHandler.handle("HTTP GET request failed: " .. err)
        return nil, err
    end

    local response_body, pos, err = json.decode(response.body, 1, nil)
    if err then
        ErrorHandler.handle("JSON decode error: " .. err)
        return nil, err
    end

    return response_body, nil
end

-- Function to make a POST request
-- @param url: the URL to send the request to
-- @param payload: table to be encoded as JSON and sent in the request body
-- @param headers: optional table of headers to include in the request
-- @return: response body as a table, or nil and error message
function HttpClient.post(url, payload, headers)
    local body = json.encode(payload)
    local response, err = http.request("POST", url, body, { headers = headers })
    if not response then
        ErrorHandler.handle("HTTP POST request failed: " .. err)
        return nil, err
    end

    local response_body, pos, err = json.decode(response.body, 1, nil)
    if err then
        ErrorHandler.handle("JSON decode error: " .. err)
        return nil, err
    end

    return response_body, nil
end

return HttpClient
