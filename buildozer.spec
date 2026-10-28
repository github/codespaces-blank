[app]
# (str) Title of your application
title = My Kivy App

# (str) Package name
package.name = mykivyapp

# (str) Package domain (needed for android packaging)
package.domain = org.example

# (str) Source code where the main.py lives
source.dir = .

# (list) Source files to include (let empty to include all the files)
source.include_exts = py,png,jpg,kv,atlas

# (str) Application versioning
version = 0.2

# (list) Application requirements
# comma separated e.g. requirements = sqlite3,kivy
# - kivymd : Material Design widgets (KivyMD)
# - ffpyplayer : pulls in the ffmpeg + SDL2 recipes automatically
# - SDL2 / OpenGL ES 2 (and 3 on supported devices) come from the 'sdl2' bootstrap below
# - pyjnius (Java <-> Python bridge) is added automatically by the android bootstrap
requirements = python3,kivy,kivymd,ffpyplayer

# (str) Pin python-for-android to a commit that ships a known-good
# build stack: Python 3.11.5 + ffmpeg 6.1.2 + ffpyplayer 4.5.1.
# - Newer p4a defaults Python to 3.14.0, whose host build is broken
#   ("No module named 'math'"), and
# - ffmpeg 8.x (p4a commit e564e44d, Jan 2026) removed
#   'libavcodec/avfft.h', breaking ffpyplayer (p4a issue #3344).
p4a.commit = c02cf781a0d3d232eb4ffbeaf580cc82cf2bd65f

# (list) Supported orientations
orientation = portrait

# -----------------------------------------------------------------------------
# Android specific configuration
# -----------------------------------------------------------------------------

# (int) Target Android API, should be as high as possible.
android.api = 34

# (int) Minimum API your APK will support.
android.minapi = 21

# (str) Android NDK version. r25b (clang 14) is required for the pinned
# ffmpeg 6.1.2: newer NDKs use clang CFLAGS that turn the Vulkan callback
# warning in libavutil/hwcontext_vulkan.c into a hard error.
android.ndk = 25b

# (list) App permissions
# - INTERNET and READ/WRITE_EXTERNAL_STORAGE
# - MANAGE_EXTERNAL_STORAGE = "All files access" storage manager (granted via
#   system settings; main.py opens that screen through pyjnius)
android.permissions = INTERNET,READ_EXTERNAL_STORAGE,WRITE_EXTERNAL_STORAGE,MANAGE_EXTERNAL_STORAGE

# (list) The Android architectures to build for
android.archs = armeabi-v7a

# (str) Android logcat filters to use
android.logcat_filters = *:S python:D

# (bool) Copy library instead of making a libpymodules.so
android.copy_libs = 1

# (str) The bootstrap to use for android builds
android.bootstrap = sdl2
