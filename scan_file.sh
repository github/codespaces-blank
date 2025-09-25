#!/bin/bash

# Script untuk memindai file langsung tanpa upload melalui web

if [ $# -eq 0 ]; then
  echo "Penggunaan: $0 <path-to-file>"
  exit 1
fi

FILE_PATH="$1"
TEMP_DIR="/var/www/tmp"

if [ ! -f "$FILE_PATH" ]; then
  echo "Error: File $FILE_PATH tidak ditemukan."
  exit 1
fi

FILE_NAME=$(basename "$FILE_PATH")
DEST_PATH="$TEMP_DIR/direct-scan-$FILE_NAME"

# Copy file to scan directory
echo "Menyalin $FILE_PATH ke $DEST_PATH..."
sudo cp "$FILE_PATH" "$DEST_PATH"
sudo chmod 644 "$DEST_PATH"
sudo chown www-data:www-data "$DEST_PATH"

echo "Memulai pemindaian..."
# Run clamscan directly
SCAN_RESULT=$(sudo clamscan --infected --recursive=yes --archive-verbose "$DEST_PATH")
SCAN_STATUS=$?

echo "Hasil pemindaian:"
echo "$SCAN_RESULT"
echo ""

if [ $SCAN_STATUS -eq 0 ]; then
  echo "Status: File bersih"
elif [ $SCAN_STATUS -eq 1 ]; then
  echo "Status: File terinfeksi virus/malware"
else
  echo "Status: Terjadi kesalahan saat pemindaian"
fi

# Clean up
echo "Menghapus file sementara..."
sudo rm -f "$DEST_PATH"
echo "Selesai."