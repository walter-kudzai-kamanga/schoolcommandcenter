from django.db import models
from staff.models import Staff

# Create your models here.

class LessonPlan(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    teacher = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='lesson_plans')
    subject = models.CharField(max_length=100)
    week = models.PositiveIntegerField()
    objectives = models.TextField()
    coverage = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)  # % complete
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    reviewer = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_lesson_plans')
    review_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subject} - Week {self.week} ({self.teacher})"

class LessonMaterial(models.Model):
    lesson_plan = models.ForeignKey(LessonPlan, on_delete=models.CASCADE, related_name='materials')
    file = models.FileField(upload_to='lesson_plans/materials/')
    material_type = models.CharField(max_length=20, choices=[('pdf', 'PDF'), ('video', 'Video'), ('other', 'Other')], default='pdf')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Material for {self.lesson_plan} ({self.material_type})"
