from rest_framework.routers import DefaultRouter
from .views import StaffViewSet, PayrollViewSet, LeaveRequestViewSet, StaffAttendanceViewSet

router = DefaultRouter()
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'payroll', PayrollViewSet, basename='payroll')
router.register(r'leave-requests', LeaveRequestViewSet, basename='leaverequest')
router.register(r'attendance', StaffAttendanceViewSet, basename='staffattendance')

urlpatterns = router.urls 