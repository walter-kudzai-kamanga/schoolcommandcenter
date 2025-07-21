from django.contrib import admin
from .models import Staff, Payroll, LeaveRequest, StaffAttendance

admin.site.register(Staff)
admin.site.register(Payroll)
admin.site.register(LeaveRequest)
admin.site.register(StaffAttendance)
