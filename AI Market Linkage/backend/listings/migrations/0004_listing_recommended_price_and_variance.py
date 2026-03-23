from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0003_listing_predicted_class'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='recommended_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='listing',
            name='price_variance_flag',
            field=models.CharField(
                blank=True,
                choices=[('OVERPRICED', 'Overpriced'), ('UNDERPRICED', 'Underpriced'), ('FAIR', 'Fairly Priced')],
                max_length=20,
                null=True,
            ),
        ),
    ]
