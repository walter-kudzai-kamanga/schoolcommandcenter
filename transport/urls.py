from rest_framework.routers import DefaultRouter
from .views import DriverViewSet, RouteViewSet, BusViewSet, StudentTransportAssignmentViewSet, BusMaintenanceViewSet

router = DefaultRouter()
router.register(r'drivers', DriverViewSet, basename='driver')
router.register(r'routes', RouteViewSet, basename='route')
router.register(r'buses', BusViewSet, basename='bus')
router.register(r'student-assignments', StudentTransportAssignmentViewSet, basename='studenttransportassignment')
router.register(r'maintenance', BusMaintenanceViewSet, basename='busmaintenance')

urlpatterns = router.urls 