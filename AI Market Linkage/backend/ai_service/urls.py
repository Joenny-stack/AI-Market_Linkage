from django.urls import path

from .views import PriceRecommendationAPIView, TomatoClassificationAPIView

urlpatterns = [
    path("classify-tomato/", TomatoClassificationAPIView.as_view(), name="classify-tomato"),
    path("recommend-price/", PriceRecommendationAPIView.as_view(), name="recommend-price"),
]
