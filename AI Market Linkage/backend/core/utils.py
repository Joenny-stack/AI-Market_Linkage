"""
Utility functions for the core app.
"""
from django.core.mail import send_mail
from django.conf import settings


def send_inquiry_notification(inquiry):
    """
    Send email notification to farmer about new inquiry.
    """
    farmer = inquiry.listing.farmer
    buyer = inquiry.buyer
    
    subject = f"New Inquiry about your {inquiry.listing.crop_name} listing"
    message = f"""
    Dear {farmer.full_name},
    
    {buyer.full_name} ({buyer.email}) has sent an inquiry about your listing:
    
    Crop: {inquiry.listing.crop_name}
    Quantity: {inquiry.listing.quantity_available} {inquiry.listing.unit}
    
    Message: {inquiry.message}
    
    Contact: {inquiry.contact_phone}
    
    Please log in to respond to this inquiry.
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [farmer.email],
            fail_silently=False
        )
    except Exception as e:
        print(f"Error sending email: {e}")
