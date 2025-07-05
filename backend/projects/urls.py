from django.urls import path

from projects.views import ProjectApiView

urlpatterns = [
    path('', ProjectApiView.as_view(), name='project-view'),
]