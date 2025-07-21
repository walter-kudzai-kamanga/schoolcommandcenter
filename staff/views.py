from django.shortcuts import render
from rest_framework import viewsets
from .models import Staff, Payroll, LeaveRequest, StaffAttendance
from .serializers import StaffSerializer, PayrollSerializer, LeaveRequestSerializer, StaffAttendanceSerializer

# Create your views here.

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer

class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer

class StaffAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StaffAttendance.objects.all()
    serializer_class = StaffAttendanceSerializer
