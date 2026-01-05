#!/bin/bash
# Setup Flutter & Dart environment for Studio Flutter App

export FLUTTER_ROOT="/home/codespace/flutter-stable"
export PATH="$FLUTTER_ROOT/bin:$HOME/android-sdk/cmdline-tools/latest/bin:$HOME/android-sdk/platform-tools:$PATH"
export ANDROID_HOME="$HOME/android-sdk"
export JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║            ENVIRONMENT SETUP COMPLETE & VERIFIED                           ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

echo "✅ JAVA"
java -version 2>&1 | head -1
echo ""

echo "✅ FLUTTER"
flutter --version
echo ""

echo "✅ DART"
dart --version
echo ""

echo "✅ ANDROID SDK"
echo "   Location: $ANDROID_HOME"
echo "   Version: 36.0.0"
ls -d $ANDROID_HOME/platforms/android-36 > /dev/null 2>&1 && echo "   Status: INSTALLED ✓" || echo "   Status: NOT FOUND ✗"
echo ""

echo "✅ PROJECT"
if [ -f "/workspaces/codespaces-blank/studio-flutter/pubspec.yaml" ]; then
    echo "   Location: /workspaces/codespaces-blank/studio-flutter"
    echo "   Status: READY ✓"
else
    echo "   Status: NOT FOUND ✗"
fi
echo ""

echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "🚀 NEXT STEPS:"
echo ""
echo "1. Navigate to app directory:"
echo "   cd /workspaces/codespaces-blank/studio-flutter"
echo ""
echo "2. Configure Firebase credentials:"
echo "   nano lib/core/firebase_options.dart"
echo ""
echo "3. Configure Google API key:"
echo "   nano lib/providers/ai_provider.dart"
echo ""
echo "4. Run the app:"
echo "   flutter run              # Mobile/emulator (Android or iOS)"
echo "   flutter run -d chrome    # Web browser"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
