from django.db import models
from staff.models import Staff
from students.models import Student

class Homework(models.Model):
    teacher = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='homeworks')
    subject = models.CharField(max_length=100)
    homework_class = models.CharField(max_length=100)  # Placeholder for class info
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    attachment = models.FileField(upload_to='homework/attachments/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.subject}) - {self.homework_class}"

class HomeworkSubmission(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('completed', 'Completed'),
        ('late', 'Late'),
    ]
    homework = models.ForeignKey(Homework, on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='homework_submissions')
    file = models.FileField(upload_to='homework/submissions/', blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    feedback = models.TextField(blank=True)

    def __str__(self):
        return f"{self.student} - {self.homework} ({self.status})"
