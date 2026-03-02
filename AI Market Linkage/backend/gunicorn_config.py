"""
Deployment configuration for production.
"""
# This file is for Gunicorn & production server configuration
bind = "0.0.0.0:8000"
workers = 4
worker_class = "sync"
timeout = 30
accesslog = "-"
errorlog = "-"
