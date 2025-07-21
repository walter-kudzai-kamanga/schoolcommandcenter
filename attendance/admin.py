from django.contrib import admin
from .models import AttendanceRecord, AbsenceAlert

admin.site.register(AttendanceRecord)
admin.site.register(AbsenceAlert)
