from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='predicted_class',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
