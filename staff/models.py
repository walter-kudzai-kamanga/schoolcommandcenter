from django.db import models

# Create your models here.

class Staff(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True)
    role = models.CharField(max_length=50)  # e.g., Teacher, Admin, Principal
    subjects = models.CharField(max_length=200, blank=True)  # Comma-separated for now
    schedule = models.TextField(blank=True)  # Placeholder for schedule data
    photo = models.ImageField(upload_to='staff/photos/', blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.role})"

class Payroll(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='payrolls')
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='Pending')  # e.g., Paid, Pending
    last_paid = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"Payroll for {self.staff} - {self.status}"

class LeaveRequest(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='leave_requests')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, default='Pending')  # Pending, Approved, Rejected
    requested_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Leave {self.status} for {self.staff} ({self.start_date} to {self.end_date})"

class StaffAttendance(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(auto_now_add=True)
    check_in = models.TimeField(blank=True, null=True)
    check_out = models.TimeField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True)  # For mobile location

    def __str__(self):
        return f"Attendance for {self.staff} on {self.date}"
