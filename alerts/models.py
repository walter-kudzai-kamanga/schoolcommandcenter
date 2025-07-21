from django.db import models
from staff.models import Staff

class Alert(models.Model):
    ALERT_TYPE_CHOICES = [
        ('discipline', 'Discipline'),
        ('safety', 'Safety/Security'),
        ('maintenance', 'Maintenance'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    reported_by = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, related_name='reported_alerts')
    type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    assigned_to = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_alerts')
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(blank=True, null=True)
    attachment = models.FileField(upload_to='alerts/attachments/', blank=True, null=True)

    def __str__(self):
        return f"{self.type} - {self.status} ({self.created_at.date()})"

class AlertComment(models.Model):
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True)
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user} on {self.timestamp}"
