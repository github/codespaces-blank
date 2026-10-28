# My Kivy App

A simple Android app built with [Kivy](https://kivy.org) and
[KivyMD](https://kivymd.readthedocs.io) — a Material Design welcome screen with
buttons to test internet access, file storage, and the ffpyplayer/ffmpeg
libraries.

## Permissions (in `buildozer.spec`)

- `INTERNET` — connectivity test
- `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE`
- `MANAGE_EXTERNAL_STORAGE` — **All files access** storage manager
  (grant via the in-app "Manage Storage" button, opened from system settings)

## Build the APK

The APK is built automatically by GitHub Actions on every push to `main`
(see [`.github/workflows/build.yml`](.github/workflows/build.yml)).

To download the latest APK:

1. Open the repo's **Actions** tab and click the latest **Build Android APK** run.
2. Download the **Kivy-Android-Debug-APK** artifact and install it on your phone.

## Run locally (desktop)

```bash
pip install kivy
python main.py
```

## Build locally (Android)

```bash
pip install buildozer
buildozer android debug
```

The generated APK is written to `bin/`.
