from rest_framework import serializers
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            "id",
            "service_name",
            "owner_name",
            "cost",
            "billing_cycle",
            "category",
            "last_paid_date",
            "next_renewal_date",
            "is_active",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]