from django.core.management.base import BaseCommand
from seed_data import seed_database


class Command(BaseCommand):
    help = 'Seeds database with initial City and Activity data for GlobeTrotter'

    def handle(self, *args, **options):
        self.stdout.write("Running seed_database command...")
        seed_database()
        self.stdout.write(self.style.SUCCESS("Successfully seeded database!"))
