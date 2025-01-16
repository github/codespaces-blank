local json = require("dkjson")
local ErrorHandler = require("modules.error_handler")

local JsonHandler = {}

-- Function to parse JSON string into a Lua table
-- @param json_string: JSON string to be parsed
-- @return: Lua table representation of the JSON string, or nil and error message
function JsonHandler.parse(json_string)
    local result, pos, err = json.decode(json_string, 1, nil)
    if err then
        ErrorHandler.handle("JSON parse error: " .. err)
        return nil, err
    end
    return result, nil
end

-- Function to serialize a Lua table into a JSON string
-- @param lua_table: Lua table to be serialized
-- @return: JSON string representation of the Lua table, or nil and error message
function JsonHandler.serialize(lua_table)
    local result, err = json.encode(lua_table)
    if not result then
        ErrorHandler.handle("JSON serialize error: " .. err)
        return nil, err
    end
    return result, nil
end

return JsonHandler
