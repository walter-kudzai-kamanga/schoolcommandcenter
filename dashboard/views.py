from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class DashboardStatsAPIView(APIView):
    def get(self, request):
        data = {
            'totals': {
                'students': 1200,
                'staff': 85,
                'classes': 40,
                'active_lessons': 12,
            },
            'alerts': [
                {'type': 'incident', 'message': 'Fire drill scheduled', 'level': 'info'},
                {'type': 'maintenance', 'message': 'AC repair in Block B', 'level': 'warning'},
                {'type': 'security', 'message': 'Visitor at gate', 'level': 'alert'},
            ],
            'financial_summary': {
                'pending_fees': 25000,
                'payroll_status': 'On Track',
            },
            'attendance_snapshot': {
                'present': 1100,
                'absent': 100,
                'late': 20,
            },
        }
        return Response(data, status=status.HTTP_200_OK)
