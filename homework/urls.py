from rest_framework.routers import DefaultRouter
from .views import HomeworkViewSet, HomeworkSubmissionViewSet

router = DefaultRouter()
router.register(r'homework', HomeworkViewSet, basename='homework')
router.register(r'submissions', HomeworkSubmissionViewSet, basename='homeworksubmission')

urlpatterns = router.urls 