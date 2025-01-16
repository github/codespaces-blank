local ErrorHandler = {}
local logger = require("utils.logger")

-- Function to log and handle errors
-- @param err: error message or object
-- @param context: additional context information (optional)
function ErrorHandler.handle(err, context)
    -- Log the error with context information
    logger.error("Error: " .. tostring(err))
    if context then
        logger.error("Context: " .. tostring(context))
    end

    -- Additional error handling logic can be added here
    -- For example, sending alerts, retrying operations, etc.
end

-- Function to wrap a function call with error handling
-- @param func: function to be called
-- @param ...: arguments to be passed to the function
-- @return: result of the function call or nil if an error occurred
function ErrorHandler.safe_call(func, ...)
    local status, result = pcall(func, ...)
    if not status then
        ErrorHandler.handle(result)
        return nil
    end
    return result
end

return ErrorHandler


