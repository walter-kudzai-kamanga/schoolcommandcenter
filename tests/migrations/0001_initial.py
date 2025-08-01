# Generated by Django 5.2.4 on 2025-07-21 06:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('staff', '0001_initial'),
        ('students', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(max_length=100)),
                ('test_class', models.CharField(max_length=100)),
                ('date', models.DateField()),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('teacher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tests', to='staff.staff')),
            ],
        ),
        migrations.CreateModel(
            name='TestAssignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('submission', models.FileField(blank=True, null=True, upload_to='tests/submissions/')),
                ('feedback', models.TextField(blank=True)),
                ('submitted_at', models.DateTimeField(blank=True, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='test_assignments', to='students.student')),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='assignments', to='tests.test')),
            ],
        ),
        migrations.CreateModel(
            name='TestQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question_type', models.CharField(choices=[('mcq', 'Multiple Choice'), ('short', 'Short Answer'), ('long', 'Long Answer')], max_length=10)),
                ('question_text', models.TextField()),
                ('marks', models.PositiveIntegerField()),
                ('option_a', models.CharField(blank=True, max_length=255)),
                ('option_b', models.CharField(blank=True, max_length=255)),
                ('option_c', models.CharField(blank=True, max_length=255)),
                ('option_d', models.CharField(blank=True, max_length=255)),
                ('correct_option', models.CharField(blank=True, max_length=1)),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='tests.test')),
            ],
        ),
    ]
