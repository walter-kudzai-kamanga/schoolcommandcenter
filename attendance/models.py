from django.db import models
from students.models import Student
from staff.models import Staff

# Create your models here.

class AttendanceRecord(models.Model):
    SESSION_CHOICES = [
        ('AM', 'Morning'),
        ('PM', 'Afternoon'),
    ]
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
        ('late', 'Late'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    session = models.CharField(max_length=2, choices=SESSION_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    marked_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.date} {self.session} - {self.status}"

class AbsenceAlert(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='absence_alerts')
    consecutive_absences = models.PositiveIntegerField()
    triggered_on = models.DateField(auto_now_add=True)
    resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Alert: {self.student} - {self.consecutive_absences} absences on {self.triggered_on}"
