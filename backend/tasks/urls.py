from django.urls import path

from tasks.views import TaskApiView, TaskDetailApiView

urlpatterns = [
    path('', TaskApiView.as_view(), name='tasks'),
    path('project/<uuid:project_id>/', TaskApiView.as_view()),
    path('<int:pk>', TaskDetailApiView.as_view(), name='task-detail'),
]
