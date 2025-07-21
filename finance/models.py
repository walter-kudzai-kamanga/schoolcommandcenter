from django.db import models
from students.models import Student

# Create your models here.

class FeeStructure(models.Model):
    GRADE_CHOICES = [
        ('Grade 1', 'Grade 1'),
        ('Grade 2', 'Grade 2'),
        # Add more grades as needed
    ]
    TERM_CHOICES = [
        ('Term 1', 'Term 1'),
        ('Term 2', 'Term 2'),
        ('Term 3', 'Term 3'),
    ]
    grade = models.CharField(max_length=20, choices=GRADE_CHOICES)
    term = models.CharField(max_length=20, choices=TERM_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.grade} - {self.term} ({self.amount})"

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('unpaid', 'Unpaid'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    ]
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='invoices')
    fee_structure = models.ForeignKey(FeeStructure, on_delete=models.SET_NULL, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    issued_on = models.DateField(auto_now_add=True)
    paid_on = models.DateField(blank=True, null=True)
    receipt = models.FileField(upload_to='finance/receipts/', blank=True, null=True)

    def __str__(self):
        return f"Invoice {self.id} - {self.student} ({self.status})"

class Payment(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_on = models.DateField(auto_now_add=True)
    method = models.CharField(max_length=50, blank=True)  # e.g., Cash, Bank, Mobile
    reference = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Payment {self.amount} for {self.invoice}"

class FinancialReport(models.Model):
    REPORT_TYPE_CHOICES = [
        ('daily', 'Daily'),
        ('monthly', 'Monthly'),
        ('class', 'Per Class'),
    ]
    report_type = models.CharField(max_length=20, choices=REPORT_TYPE_CHOICES)
    period = models.CharField(max_length=50)  # e.g., '2024-07', '2024-07-01', 'Grade 1'
    data = models.JSONField()
    generated_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.report_type} report for {self.period}"
