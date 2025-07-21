"""
URL configuration for school_command_center project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/students/', include('students.urls')),
    path('api/staff/', include('staff.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/lesson-plans/', include('lesson_plans.urls')),
    path('api/tests/', include('tests.urls')),
    path('api/homework/', include('homework.urls')),
    path('api/finance/', include('finance.urls')),
    path('api/inventory/', include('inventory.urls')),
    path('api/transport/', include('transport.urls')),
    path('api/alerts/', include('alerts.urls')),
]
