# Generated by Django 5.1.1 on 2025-03-13 16:48

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("userAPI", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="appuser",
            name="firstname",
            field=models.CharField(default="firstname", max_length=50),
        ),
        migrations.AddField(
            model_name="appuser",
            name="lastname",
            field=models.CharField(default="lastname", max_length=50),
        ),
    ]
