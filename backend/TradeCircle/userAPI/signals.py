from django.apps import AppConfig
from django.db.backends.signals import connection_created

class UserApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'userAPI'

    def ready(self): # listens for when a new database connection is made.
        #Connect the signal in the ready method
        connection_created.connect(self.set_journal_mode)
    
    def set_journal_mode(self, sender, connection, **kwargs):
        cursor = connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL;") # Set journal mode to WAL (Write-Ahead Logging)
        #Improves database performance and prevents data corruption.
        cursor.execute("PRAGMA busy_timeout=30000;")  # Waits up to 30 seconds if the database is locked, instead of failing immediately.