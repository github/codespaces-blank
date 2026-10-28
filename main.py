"""
My Kivy App — KivyMD + storage manager demo.

- KivyMD Material Design UI
- INTERNET permission (connectivity test)
- READ/WRITE_EXTERNAL_STORAGE (write test to Downloads)
- MANAGE_EXTERNAL_STORAGE ("All files access" storage manager, opened
  from system settings through pyjnius)
- ffpyplayer / ffmpeg availability check (pulled in by buildozer.spec)
"""

import os

import kivy
from kivy.uix.boxlayout import BoxLayout

from kivymd.app import MDApp
from kivymd.uix.button import MDRaisedButton
from kivymd.uix.label import MDLabel


def is_android():
    return 'ANDROID_ROOT' in os.environ or os.path.exists('/storage/emulated/0')


def downloads_dir():
    """Directory used for the storage write test."""
    if is_android():
        try:
            from android.storage import primary_external_storage_path
            return os.path.join(primary_external_storage_path(), 'Download')
        except Exception:
            return '/storage/emulated/0/Download'
    return os.path.expanduser('~/Downloads')


class MainApp(MDApp):
    def build(self):
        self.theme_cls.primary_palette = 'Blue'
        self.title = 'My Kivy App'

        layout = BoxLayout(
            orientation='vertical', padding=20, spacing=12
        )

        welcome = MDLabel(
            text='Welcome to your Kivy App!',
            halign='center',
            font_style='H5',
        )

        # Shows versions / environment info once checked
        self.status = MDLabel(
            text='Tap a button to run a test.',
            halign='center',
            theme_text_color='Secondary',
        )

        self.add_button(layout, 'Check Libraries', self.check_libraries)
        self.add_button(layout, 'Test Internet', self.check_internet)
        self.add_button(layout, 'Test Storage (write file)', self.test_storage)
        self.add_button(layout, 'Manage Storage (All files access)',
                        self.open_all_files_settings)

        layout.add_widget(welcome)
        layout.add_widget(self.status)
        return layout

    def add_button(self, layout, text, callback):
        btn = MDRaisedButton(text=text, size_hint=(1, None),
                             height='48dp', on_press=callback)
        layout.add_widget(btn)

    def set_status(self, msg):
        self.status.text = msg

    # ------------------------------------------------------------------ #
    # Button actions
    # ------------------------------------------------------------------ #

    def check_libraries(self, *args):
        """Verify ffpyplayer (ffmpeg backend) and the SDL2/OpenGL ES window.
        Running this at all on Android means SDL2 + OpenGL ES initialized."""
        import ffpyplayer
        from kivy.core.window import Window  # noqa: F401  (forces GL init)

        self.set_status('Kivy {} ✓ | ffpyplayer {} ✓ (ffmpeg) | '
                        'SDL2 + OpenGL ES ✓'.format(
                            kivy.__version__, ffpyplayer.__version__))

    def check_internet(self, *args):
        """Quick connectivity test (needs the INTERNET permission)."""
        import threading

        def run():
            try:
                from urllib import request
                with request.urlopen('https://kivy.org', timeout=5) as resp:
                    msg = 'Internet OK (HTTP {})'.format(resp.status)
            except Exception as e:
                msg = 'Internet failed: {}'.format(e)
            self.set_status(msg)

        self.set_status('Checking internet…')
        threading.Thread(target=run, daemon=True).start()

    def test_storage(self, *args):
        """Write a test file to the shared Downloads folder."""
        target = os.path.join(downloads_dir(), 'mykivyapp_test.txt')
        try:
            os.makedirs(downloads_dir(), exist_ok=True)
            with open(target, 'w') as f:
                f.write('Hello from My Kivy App!\n')
            self.set_status('Storage OK: wrote {}'.format(target))
        except PermissionError:
            self.set_status('Storage denied — use "Manage Storage" to '
                            'grant all-files access, then try again.')
        except Exception as e:
            self.set_status('Storage failed: {}'.format(e))

    def open_all_files_settings(self, *args):
        """Open the system 'All files access' (MANAGE_EXTERNAL_STORAGE)
        settings screen for this app via pyjnius."""
        if not is_android():
            self.set_status('"All files access" is Android-only.')
            return
        try:
            from jnius import autoclass

            Settings = autoclass('android.provider.Settings')
            Environment = autoclass('android.os.Environment')
            Intent = autoclass('android.content.Intent')
            Uri = autoclass('android.net.Uri')
            PythonActivity = autoclass('org.kivy.android.PythonActivity')

            if Environment.isExternalStorageManager():
                self.set_status('All-files access already granted ✓')
                return

            package = PythonActivity.mPackageName
            intent = Intent(
                Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION,
                Uri.parse('package:' + package),
                )
            PythonActivity.mActivity.startActivity(intent)
            self.set_status('Opened storage settings — grant access, then '
                            'run the storage test.')
        except Exception as e:
            self.set_status('Could not open storage settings: {}'.format(e))


if __name__ == '__main__':
    MainApp().run()
