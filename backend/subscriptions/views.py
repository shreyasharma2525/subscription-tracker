from django.db import IntegrityError
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Subscription
from .serializers import SubscriptionSerializer


class SubscriptionListCreateView(generics.ListCreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        service_name = serializer.validated_data.get("service_name")
        owner_name = serializer.validated_data.get("owner_name")

        duplicate_exists = Subscription.objects.filter(
            user=self.request.user,
            service_name__iexact=service_name,
            owner_name__iexact=owner_name,
        ).exists()

        if duplicate_exists:
            raise ValidationError(
                "This subscription already exists for this user."
            )

        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise ValidationError(
                "Duplicate subscription is not allowed."
            )


class SubscriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)