from django.db import models
from django.conf import settings


class Subscription(models.Model):
    BILLING_CYCLE_CHOICES = [
        ("monthly", "Monthly"),
        ("yearly", "Yearly"),
        ("weekly", "Weekly"),
    ]

    CATEGORY_CHOICES = [
        ("entertainment", "Entertainment"),
        ("productivity", "Productivity"),
        ("fitness", "Fitness"),
        ("utilities", "Utilities"),
        ("education", "Education"),
        ("other", "Other"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscriptions"
    )

    service_name = models.CharField(max_length=100)

    owner_name = models.CharField(
        max_length=100,
        default="Shreya Sharma"
    )

    cost = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    billing_cycle = models.CharField(
        max_length=10,
        choices=BILLING_CYCLE_CHOICES,
        default="monthly"
    )

    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default="other"
    )

    last_paid_date = models.DateField()

    next_renewal_date = models.DateField()

    is_active = models.BooleanField(default=True)

    notes = models.TextField(
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner_name} - {self.service_name}"

    class Meta:
        ordering = ["next_renewal_date"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "service_name", "owner_name"],
                name="unique_subscription_per_user_owner"
            )
        ]