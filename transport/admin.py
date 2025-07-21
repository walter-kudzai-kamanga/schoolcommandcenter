from django.contrib import admin
from .models import Driver, Route, Bus, StudentTransportAssignment, BusMaintenance

admin.site.register(Driver)
admin.site.register(Route)
admin.site.register(Bus)
admin.site.register(StudentTransportAssignment)
admin.site.register(BusMaintenance)
