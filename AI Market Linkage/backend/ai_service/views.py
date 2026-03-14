import os
import tempfile
import logging

from django.conf import settings
from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .predict import predict_tomato


logger = logging.getLogger(__name__)


class TomatoClassificationAPIView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        image_file = request.FILES.get("image")
        if image_file is None:
            return Response(
                {"error": "Image file is required under key 'image'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        extension = image_file.name.rsplit(".", 1)[-1].lower() if "." in image_file.name else ""
        if extension not in settings.ALLOWED_UPLOAD_EXTENSIONS:
            return Response(
                {"error": "Invalid file type. Allowed: jpg, jpeg, png, gif, webp."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if image_file.size > settings.MAX_UPLOAD_SIZE:
            return Response(
                {"error": f"File too large. Max size is {settings.MAX_UPLOAD_SIZE // (1024 * 1024)}MB."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        temp_path = ""
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=f".{extension}") as temp_file:
                for chunk in image_file.chunks():
                    temp_file.write(chunk)
                temp_path = temp_file.name

            prediction = predict_tomato(temp_path)
            return Response(prediction, status=status.HTTP_200_OK)
        except (FileNotFoundError, RuntimeError) as exc:
            logger.exception("AI classifier unavailable")
            return Response(
                {"error": f"AI classifier unavailable: {str(exc)}"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception as exc:
            logger.exception("Unexpected tomato classification failure")
            return Response(
                {"error": f"Prediction failed: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)
