from datetime import timedelta

from django.utils.timezone import now
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

from users.serializers import RegisterUserSerializer


class RegisterView(CreateAPIView):
    serializer_class = RegisterUserSerializer
    permission_classes = (AllowAny,)
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            email_errors = serializer.errors.get('email', [])
            if any("already exists" in str(e).lower() for e in email_errors):
                return Response({'error': 'Profile with that email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': 'Error while parsing data'}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

        access_exp = now() + timedelta(minutes=15)
        refresh_exp = now() + timedelta(days=7)

        response = Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }, status=status.HTTP_201_CREATED)

        # Access Token cookie
        response.set_cookie(
            key='access_token',
            value=str(access_token),
            expires=access_exp,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax'
        )

        # Refresh Token cookie
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            expires=refresh_exp,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax'
        )

        return response



