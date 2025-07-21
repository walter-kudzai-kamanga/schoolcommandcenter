from django.db import models
from students.models import Student

# Create your models here.

class Driver(models.Model):
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=50)
    license_number = models.CharField(max_length=50)
    assigned_bus = models.OneToOneField('Bus', on_delete=models.SET_NULL, null=True, blank=True, related_name='driver')

    def __str__(self):
        return f"{self.name} ({self.license_number})"

class Route(models.Model):
    name = models.CharField(max_length=100)
    stops = models.TextField(help_text='Comma-separated list of stops')
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Bus(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('maintenance', 'Under Maintenance'),
        ('retired', 'Retired'),
    ]
    number = models.CharField(max_length=20, unique=True)
    capacity = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    route = models.ForeignKey(Route, on_delete=models.SET_NULL, null=True, blank=True, related_name='buses')
    maintenance_notes = models.TextField(blank=True)

    def __str__(self):
        return f"Bus {self.number} ({self.status})"

class StudentTransportAssignment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='transport_assignments')
    bus = models.ForeignKey(Bus, on_delete=models.SET_NULL, null=True, blank=True, related_name='student_assignments')
    route = models.ForeignKey(Route, on_delete=models.SET_NULL, null=True, blank=True, related_name='student_assignments')
    pickup_location = models.CharField(max_length=200, blank=True)
    dropoff_location = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.student} - Bus {self.bus} ({self.route})"

class BusMaintenance(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='maintenance_records')
    date = models.DateField()
    description = models.TextField()
    status = models.CharField(max_length=50, blank=True)  # e.g., Completed, Pending
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"Maintenance for {self.bus} on {self.date}"
