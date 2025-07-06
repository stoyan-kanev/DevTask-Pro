from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from tasks.models import Task
from tasks.serializers import TaskSerializer


class TaskApiView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer


    def get(self, request,project_id=None):
        tasks = Task.objects.filter(project_id=project_id)
        serializer = self.serializer_class(tasks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailApiView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer

    def get_object(self, pk, user):
        return Task.objects.get(id=pk, user=user)

    def put(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        task = self.get_object(pk, request.user)
        if not task:
            return Response(status=status.HTTP_404_NOT_FOUND)
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)