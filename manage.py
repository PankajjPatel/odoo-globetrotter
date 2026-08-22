#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from pathlib import Path

# Automatically discover and add venv site-packages if django is not installed in global environment
try:
    import django
except ModuleNotFoundError:
    base_dir = Path(__file__).resolve().parent
    win_venv = base_dir / 'venv' / 'Lib' / 'site-packages'
    nix_venv = base_dir / 'venv' / 'lib' / f'python{sys.version_info.major}.{sys.version_info.minor}' / 'site-packages'
    if win_venv.exists():
        sys.path.insert(0, str(win_venv))
    elif nix_venv.exists():
        sys.path.insert(0, str(nix_venv))


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'globetrotter.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()

