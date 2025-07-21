from rest_framework import serializers
from .models import AttendanceRecord, AbsenceAlert

class AttendanceRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = '__all__'

class AbsenceAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbsenceAlert
        fields = '__all__' 