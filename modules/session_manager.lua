local SessionManager = {}
local sessions = {}

-- Function to get the session context for a user
-- @param user_id: unique identifier for the user
-- @return: session context table
function SessionManager.get_context(user_id)
    if not sessions[user_id] then
        sessions[user_id] = { context = {} }
    end
    return sessions[user_id].context
end

-- Function to update the session context for a user
-- @param user_id: unique identifier for the user
-- @param new_context: table containing the new context data
function SessionManager.update_context(user_id, new_context)
    if not sessions[user_id] then
        sessions[user_id] = { context = {} }
    end
    sessions[user_id].context = new_context
end

-- Function to clear the session context for a user
-- @param user_id: unique identifier for the user
function SessionManager.clear_context(user_id)
    sessions[user_id] = nil
end

return SessionManager
