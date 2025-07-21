from django.db import models
from staff.models import Staff
from students.models import Student

class Test(models.Model):
    teacher = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='tests')
    subject = models.CharField(max_length=100)
    test_class = models.CharField(max_length=100)  # Placeholder for class info
    date = models.DateField()
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.subject}) - {self.test_class}"

class TestQuestion(models.Model):
    QUESTION_TYPE_CHOICES = [
        ('mcq', 'Multiple Choice'),
        ('short', 'Short Answer'),
        ('long', 'Long Answer'),
    ]
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPE_CHOICES)
    question_text = models.TextField()
    marks = models.PositiveIntegerField()
    # MCQ fields
    option_a = models.CharField(max_length=255, blank=True)
    option_b = models.CharField(max_length=255, blank=True)
    option_c = models.CharField(max_length=255, blank=True)
    option_d = models.CharField(max_length=255, blank=True)
    correct_option = models.CharField(max_length=1, blank=True)  # 'A', 'B', 'C', 'D'

    def __str__(self):
        return f"Q: {self.question_text[:30]}... ({self.get_question_type_display()})"

class TestAssignment(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name='assignments')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='test_assignments')
    score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    submission = models.FileField(upload_to='tests/submissions/', blank=True, null=True)
    feedback = models.TextField(blank=True)
    submitted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.student} - {self.test} ({self.score})"
