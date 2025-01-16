local AuthService = {}
local jwt = require("luajwt")  -- Assuming luajwt library is used for JWT handling
local secret_key = "your_secret_key"  -- Replace with your actual secret key

-- Function to generate a JWT token
-- @param payload: table containing the data to be encoded in the token
-- @return: JWT token as a string
function AuthService.generate_token(payload)
    local token, err = jwt.encode(payload, secret_key)
    if not token then
        return nil, "Token generation failed: " .. err
    end
    return token, nil
end

-- Function to validate a JWT token
-- @param token: JWT token as a string
-- @return: decoded payload if valid, nil and error message if invalid
function AuthService.validate_token(token)
    local decoded, err = jwt.decode(token, secret_key)
    if not decoded then
        return nil, "Token validation failed: " .. err
    end
    return decoded, nil
end

-- Function to check if a request is authorized
-- @param headers: table containing the request headers
-- @return: true if authorized, false and error message if unauthorized
function AuthService.is_authorized(headers)
    local auth_header = headers["Authorization"]
    if not auth_header then
        return false, "Authorization header missing"
    end

    local token = auth_header:match("Bearer%s+(.+)")
    if not token then
        return false, "Invalid authorization header format"
    end

    local decoded, err = AuthService.validate_token(token)
    if not decoded then
        return false, err
    end

    return true, nil
end

return AuthService
