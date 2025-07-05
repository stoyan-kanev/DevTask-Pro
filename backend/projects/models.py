from django.db import models
from users.models import CustomUser as User

class Project(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='project_owner')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name