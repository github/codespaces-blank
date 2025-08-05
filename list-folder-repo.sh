#!/bin/bash

# === Configuration ===
GITLAB_URL="https://gitlab.com"
GITLAB_TOKEN="your_gitlab_token_here"
GROUP_NAME="your_group_or_username"
TMP_DIR="./repos_temp"
BRANCH_NAME="develop"

# === Create temp directory ===
mkdir -p "$TMP_DIR"

# === Get all projects (handling pagination) ===
page=1
per_page=100
project_urls=()

echo "Fetching projects from GitLab..."

while :; do
  response=$(curl -s --header "PRIVATE-TOKEN: $GITLAB_TOKEN" \
    "$GITLAB_URL/api/v4/groups/$GROUP_NAME/projects?per_page=$per_page&page=$page")

  urls=$(echo "$response" | jq -r '.[].ssh_url_to_repo')
  [[ -z "$urls" || "$urls" == "null" ]] && break

  while IFS= read -r url; do
    project_urls+=("$url")
  done <<< "$urls"

  ((page++))
done

echo "Total projects found: ${#project_urls[@]}"
echo "Cloning and counting lines in '$BRANCH_NAME' branches..."

# === For each project ===
for repo_url in "${project_urls[@]}"; do
  repo_name=$(basename "$repo_url" .git)
  repo_path="$TMP_DIR/$repo_name"

  echo "Processing: $repo_name"

  # Clone only the develop branch (shallow)
  git clone --depth 1 --branch "$BRANCH_NAME" "$repo_url" "$repo_path" &>/dev/null

  if [ $? -ne 0 ]; then
    echo "  ⚠️  Failed to clone $repo_name or branch '$BRANCH_NAME' does not exist."
    continue
  fi

  # Count lines (non-empty lines only)
  line_count=$(find "$repo_path" -type f ! -path '*/.git/*' -exec cat {} + | grep -v '^\s*$' | wc -l)

  echo "  📄 $repo_name: $line_count lines (non-empty)"
done

# === Cleanup ===
rm -rf "$TMP_DIR"

echo "✅ Done."
