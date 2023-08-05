# Generated by Django 4.2.1 on 2023-08-05 14:50

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('repositories', '0003_alter_commit_repository'),
    ]

    operations = [
        migrations.AddField(
            model_name='commit',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='commits', to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
