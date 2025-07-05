from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models import Project
from projects.serializers import ProjectSerializer

from uuid import UUID



class ProjectApiView(APIView):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        projects = Project.objects.filter(owner=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        project_id = request.data.get('id')
        if not project_id:
            return Response({"error": "Missing project ID."}, status=400)

        try:
            uuid_obj = UUID(project_id)
        except ValueError:
            return Response({"error": "Invalid project ID format."}, status=400)

        project = get_object_or_404(Project, id=uuid_obj)

        if project.owner != request.user:
            return Response({"error": "You do not have access to this project."}, status=403)

        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        project_id = request.data.get('id')
        if not project_id:
            return Response({"error": "Missing project ID."}, status=400)

        try:
            uuid_obj = UUID(project_id)
        except ValueError:
            return Response({"error": "Invalid project ID format."}, status=400)

        project = get_object_or_404(Project, id=uuid_obj)

        if project.owner != request.user:
            return Response({"error": "Only the owner can delete this project."}, status=403)

        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
