local lfs = require("lfs")
local os = require("os")
local config = require("config.config")
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

local function setup_environment()
    logger.info("Setting up environment...")
    -- Create necessary directories
    lfs.mkdir("logs")
    lfs.mkdir("cache")
end

local function deploy_application()
    logger.info("Deploying application...")
    -- Start the chatbot application
    local result = os.execute("lua main.lua &")
    if result ~= 0 then
        logger.error("Failed to start the application")
    else
        logger.info("Application started successfully")
    end
end

local function post_deployment_checks()
    logger.info("Running post-deployment checks...")
    -- Perform basic health checks
    local response = os.execute("curl -s http://localhost:8080/health")
    if response ~= 0 then
        logger.error("Health check failed")
    else
        logger.info("Health check passed")
    end
end

local function main()
    load_environment()
    install_dependencies()
    setup_environment()
    deploy_application()
    post_deployment_checks()
end

main()
