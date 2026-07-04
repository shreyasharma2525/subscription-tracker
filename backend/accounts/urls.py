from django.urls import path
from .views import (
    RegisterView,
    CurrentUserView,
    LogoutView,
    ChangePasswordView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]