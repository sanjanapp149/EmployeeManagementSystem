from rest_framework.routers import DefaultRouter
from .views import DynamicFormViewSet

router = DefaultRouter()
router.register('forms', DynamicFormViewSet)
urlpatterns = router.urls