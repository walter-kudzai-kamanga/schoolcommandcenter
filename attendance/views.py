from django.shortcuts import render
from rest_framework import viewsets
from .models import AttendanceRecord, AbsenceAlert
from .serializers import AttendanceRecordSerializer, AbsenceAlertSerializer

# Create your views here.

class AttendanceRecordViewSet(viewsets.ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

class AbsenceAlertViewSet(viewsets.ModelViewSet):
    queryset = AbsenceAlert.objects.all()
    serializer_class = AbsenceAlertSerializer
