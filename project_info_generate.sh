#!/bin/bash

# Function to check if a file is a text file
is_text_file() {
    local file="$1"
    local mime_type=$(file -b --mime-type "$file")
    [[ $mime_type == text/* || $mime_type == application/json || $mime_type == application/javascript ]]
}

# Function to display progress bar
display_progress() {
    local current=$1
    local total=$2
    local file_name=$3
    local percentage=$((current * 100 / total))
    local completed=$((percentage / 2))
    local remaining=$((50 - completed))
    echo -ne "\r[$(printf '#%.0s' $(seq 1 $completed))$(printf ' %.0s' $(seq 1 $remaining))] $percentage% $file_name"
}

# Main script
echo "Generating project tree structure..."

# Generate tree structure
tree -L 3 -I 'node_modules|.expo|.vscode|.git|ios|android' --dirsfirst > project_structure.txt

# After generating tree structure
if [ ! -s project_structure.txt ]; then
    echo "Error: project_structure.txt is empty or not created."
    exit 1
fi

# Create a separate file for file contents
echo "File Contents:" > project_contents.txt

# Get list of files, excluding the temporary files we're creating and large files
files=($(find . -type f -not -path '*/\.*' -not -path '*/node_modules/*' -not -path '*/ios/*' -not -path '*/android/*' -not -name 'project_structure.txt' -not -name 'project_contents.txt' -not -name 'project_info.txt' -not -name 'package-lock.json'))

# Count total files
total_files=${#files[@]}
current_file=0

echo "Debug: Found ${total_files} files to process."

# Process files
for file in "${files[@]}"; do
    # Increment current file counter
    ((current_file++))

    # Display progress
    display_progress $current_file $total_files "$file"

    if [[ -f "$file" && ! "$file" =~ \.(png|jpg|jpeg|gif|bmp|ico|mp3|wav|m4a|flac|ogg|webm|mp4|avi|mov|wmv|woff|woff2|eot|ttf|otf)$ ]] && is_text_file "$file"; then
        # Get file size
        file_size=$(wc -l < "$file")

        if [ "$file_size" -le 1000 ]; then
            echo -e "\n--- $file ---\n" >> project_contents.txt
            cat "$file" >> project_contents.txt
        else
            echo -e "\n--- $file (first 50 lines) ---\n" >> project_contents.txt
            head -n 50 "$file" >> project_contents.txt
            echo -e "\n... (file truncated, total lines: $file_size) ...\n" >> project_contents.txt
        fi
    fi

    # Add debug output every 10 files
    if ((current_file % 10 == 0)); then
        echo -e "\nDebug: Processed $current_file files out of $total_files"
    fi
done

echo -e "\nDebug: Processed $current_file files."

# Move to a new line after progress bar
echo

# Combine the files
cat project_structure.txt project_contents.txt > project_info.txt

# After combining files
if [ ! -s project_info.txt ]; then
    echo "Error: project_info.txt is empty or not created."
    exit 1
fi

# Clean up temporary files
rm project_structure.txt project_contents.txt

echo "Project information has been exported to project_info.txt"

# At the end of the script
set +x
