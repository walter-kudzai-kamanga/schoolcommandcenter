# Generated by Django 5.2.4 on 2025-07-21 06:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Staff',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone', models.CharField(blank=True, max_length=20)),
                ('role', models.CharField(max_length=50)),
                ('subjects', models.CharField(blank=True, max_length=200)),
                ('schedule', models.TextField(blank=True)),
                ('photo', models.ImageField(blank=True, null=True, upload_to='staff/photos/')),
            ],
        ),
        migrations.CreateModel(
            name='Payroll',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(default='Pending', max_length=20)),
                ('last_paid', models.DateField(blank=True, null=True)),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payrolls', to='staff.staff')),
            ],
        ),
        migrations.CreateModel(
            name='LeaveRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('reason', models.TextField()),
                ('status', models.CharField(default='Pending', max_length=20)),
                ('requested_at', models.DateTimeField(auto_now_add=True)),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='leave_requests', to='staff.staff')),
            ],
        ),
        migrations.CreateModel(
            name='StaffAttendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('check_in', models.TimeField(blank=True, null=True)),
                ('check_out', models.TimeField(blank=True, null=True)),
                ('location', models.CharField(blank=True, max_length=255)),
                ('staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attendances', to='staff.staff')),
            ],
        ),
    ]
