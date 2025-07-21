from django.db import models
from datetime import datetime

# Create your models here.

class Student(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    reg_number = models.CharField(max_length=20, unique=True, blank=True)
    birth_certificate = models.FileField(upload_to='students/birth_certificates/', blank=True, null=True)
    photo = models.ImageField(upload_to='students/photos/', blank=True, null=True)
    report_card = models.FileField(upload_to='students/report_cards/', blank=True, null=True)
    # Placeholder fields for class, fees, attendance, test records
    # class_placement = models.ForeignKey('classes.Class', on_delete=models.SET_NULL, null=True, blank=True)
    # fees = models.ManyToManyField('finance.Fee', blank=True)
    # attendance = models.ManyToManyField('attendance.Attendance', blank=True)
    # test_records = models.ManyToManyField('tests.TestRecord', blank=True)

    def save(self, *args, **kwargs):
        if not self.reg_number:
            year = datetime.now().year
            last_id = Student.objects.last().id if Student.objects.exists() else 0
            new_id = str(last_id + 1).zfill(6)
            self.reg_number = f"SCH-{year}-{new_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.reg_number})"
