from rest_framework.routers import DefaultRouter
from .views import LessonPlanViewSet, LessonMaterialViewSet

router = DefaultRouter()
router.register(r'lesson-plans', LessonPlanViewSet, basename='lessonplan')
router.register(r'materials', LessonMaterialViewSet, basename='lessonmaterial')

urlpatterns = router.urls 