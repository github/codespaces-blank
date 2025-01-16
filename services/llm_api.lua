local http = require("http.client")
local json = require("dkjson")

local LLM_API = {}

-- Function to make a request to the LLM API
function LLM_API.request(endpoint, payload, api_key)
    local headers = {
        ["Content-Type"] = "application/json",
        ["Authorization"] = "Bearer " .. api_key
    }
    local body = json.encode(payload)
    local response, err = http.request("POST", endpoint, body, { headers = headers })

    if not response then
        return nil, "HTTP request failed: " .. err
    end

    local response_body, pos, err = json.decode(response.body, 1, nil)
    if err then
        return nil, "JSON decode error: " .. err
    end

    return response_body, nil
end

return LLM_API
