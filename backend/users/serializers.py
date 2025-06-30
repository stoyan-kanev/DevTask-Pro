import re

from rest_framework import serializers

from users.models import CustomUser

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'first_name','last_name','password')
        extra_kwargs = {'password': {'write_only': True}}

        def validate_password(self, value):
            if len(value) < 8:
                raise serializers.ValidationError("Password must be at least 8 characters long.")
            if not re.search(r"[A-Z]", value):
                raise serializers.ValidationError("Password must contain at least one uppercase letter.")
            if not re.search(r"[a-z]", value):
                raise serializers.ValidationError("Password must contain at least one lowercase letter.")
            if not re.search(r"\d", value):
                raise serializers.ValidationError("Password must contain at least one digit.")
            if not re.search(r"[!@#$%^&*()_+=\-{}\[\]:;\"'<>,.?/]", value):
                raise serializers.ValidationError("Password must contain at least one special character.")
            return value

        def create(self, validated_data):
            user = CustomUser.objects.create_user(
                email=validated_data['email'],
                first_name=validated_data.get('first_name'),
                last_name=validated_data.get('last_name'),
                password=validated_data['password'],
            )
            user.is_active = True
            user.save()
            return user