#!/bin/bash

# Define the base directory name
BASE_DIR="."

# Create the project directory structure
mkdir -p $BASE_DIR/{config,modules,services,utils,tests/{unit,integration,mocks},logs,docs,scripts,cache}

# Create the main application file
touch $BASE_DIR/main.lua

# Create config files
touch $BASE_DIR/config/{config.lua,environment.lua,secrets.env}

# Create module files
touch $BASE_DIR/modules/{http_client.lua,json_handler.lua,session_manager.lua,conversation_flow.lua,error_handler.lua}

# Create service files
touch $BASE_DIR/services/{llm_api.lua,cache_service.lua,auth_service.lua}

# Create utility files
touch $BASE_DIR/utils/{logger.lua,validator.lua,retry_mechanism.lua}

# Create test files
touch $BASE_DIR/tests/unit/{test_http_client.lua,test_json_handler.lua,test_session_manager.lua}
touch $BASE_DIR/tests/integration/test_end_to_end.lua
touch $BASE_DIR/tests/mocks/{mock_llm_response.lua,mock_user_input.lua}

# Create log files
touch $BASE_DIR/logs/{chatbot.log,errors.log}

# Create documentation files
touch $BASE_DIR/docs/{README.md,API.md,TROUBLESHOOTING.md}

# Create script files
touch $BASE_DIR/scripts/{setup_env.lua,deploy.lua,benchmark.lua}

# Create cache files
touch $BASE_DIR/cache/{session_cache.json,response_cache.json}

# Create other files
touch $BASE_DIR/.env
touch $BASE_DIR/.gitignore
touch $BASE_DIR/LICENSE
touch $BASE_DIR/Makefile

# Print success message
echo "Project directory structure created successfully at: $BASE_DIR"
