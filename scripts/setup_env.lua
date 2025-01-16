local lfs = require("lfs")
local os = require("os")
local logger = require("utils.logger")

local function load_environment()
    logger.info("Loading environment configurations...")
    -- Load environment variables from .env file
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

local function install_dependencies()
    logger.info("Installing dependencies...")
    -- Install necessary Lua modules
    os.execute("luarocks install http")
    os.execute("luarocks install dkjson")
    os.execute("luarocks install luajwt")
    -- Add other dependencies as needed
end

local function setup_directories()
    logger.info("Setting up directories...")
    -- Create necessary directories
    lfs.mkdir("logs")
    lfs.mkdir("cache")
end

local function initialize_config_files()
    logger.info("Initializing configuration files...")
    -- Copy or generate configuration files
    local config_template = "config/config_template.lua"
    local config_file = "config/config.lua"
    if not lfs.attributes(config_file) and lfs.attributes(config_template) then
        os.execute("cp " .. config_template .. " " .. config_file)
    end
end

local function verify_setup()
    logger.info("Verifying setup...")
    -- Perform basic checks to ensure the environment is correctly set up
    if not lfs.attributes("logs") then
        logger.error("Logs directory not found")
        return false
    end
    if not lfs.attributes("cache") then
        logger.error("Cache directory not found")
        return false
    end
    if not lfs.attributes("config/config.lua") then
        logger.error("Configuration file not found")
        return false
    end
    logger.info("Setup verification passed")
    return true
end

local function main()
    load_environment()
    install_dependencies()
    setup_directories()
    initialize_config_files()
    if verify_setup() then
        logger.info("Environment setup completed successfully")
    else
        logger.error("Environment setup failed")
    end
end

main()
