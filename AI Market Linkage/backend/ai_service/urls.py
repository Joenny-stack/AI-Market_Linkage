from django.urls import path

from .views import TomatoClassificationAPIView

urlpatterns = [
    path("classify-tomato/", TomatoClassificationAPIView.as_view(), name="classify-tomato"),
]
