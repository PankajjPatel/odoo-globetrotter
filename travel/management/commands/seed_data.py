from django.core.management.base import BaseCommand
from seed_data import seed_database


class Command(BaseCommand):
    help = 'Seeds database with 18+ cities and activities for Search & Budget modules'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Running seed_data command..."))
        seed_database()
        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))
