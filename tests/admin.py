from django.contrib import admin
from .models import Test, TestQuestion, TestAssignment

admin.site.register(Test)
admin.site.register(TestQuestion)
admin.site.register(TestAssignment)
