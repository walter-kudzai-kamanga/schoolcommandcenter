from rest_framework.routers import DefaultRouter
from .views import AttendanceRecordViewSet, AbsenceAlertViewSet

router = DefaultRouter()
router.register(r'attendance-records', AttendanceRecordViewSet, basename='attendancerecord')
router.register(r'absence-alerts', AbsenceAlertViewSet, basename='absencealert')

urlpatterns = router.urls 