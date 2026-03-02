"""
DEPLOYMENT GUIDE

This guide covers deploying the AI Market Linkage Platform to production.

## Backend Deployment (Django)

### Heroku Deployment

1. Create Heroku apps:
   - heroku create your-app-name
   - heroku addons:create heroku-postgresql:hobby-dev

2. Configure environment variables:
   - heroku config:set SECRET_KEY=your-secret-key
   - heroku config:set DEBUG=False
   - etc.

3. Deploy:
   - git push heroku main

4. Run migrations:
   - heroku run python manage.py migrate

5. Create superuser:
   - heroku run python manage.py createsuperuser

### AWS Deployment

1. Create EC2 instance
2. Install Python, PostgreSQL, nginx
3. Clone repository and install dependencies
4. Configure gunicorn
5. Set up nginx reverse proxy
6. Configure domain and SSL with Let's Encrypt

### DigitalOcean Deployment

1. Create droplet with Python
2. Install PostgreSQL, Redis, nginx
3. Clone repository
4. Set up systemd service for gunicorn
5. Configure nginx
6. Set up SSL

## Frontend Deployment (React)

### Vercel

1. Connect GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically on git push

### Netlify

1. Connect GitHub to Netlify
2. Set build command: npm run build
3. Set publish directory: dist
4. Configure environment variables
5. Deploy

### AWS S3 + CloudFront

1. Create S3 bucket
2. Build frontend: npm run build
3. Upload dist folder to S3
4. Configure CloudFront CDN
5. Set custom domain

## Environment Configuration

### Production Environment Variables

Backend (.env):
- SECRET_KEY (generate new one)
- DEBUG=False
- ALLOWED_HOSTS=yourdomain.com
- DB_HOST=production-db
- DB_NAME=production-db
- Email settings for notifications
- CORS_ALLOWED_ORIGINS=https://yourdomain.com

Frontend (.env):
- VITE_API_URL=https://api.yourdomain.com

## Security Checklist

- [ ] Set DEBUG=False
- [ ] Use strong SECRET_KEY
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure database credentials
- [ ] Enable CSRF protection
- [ ] Use environment variables for secrets
- [ ] Configure rate limiting
- [ ] Set up logging and monitoring
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Media files on Cloud Storage (S3, etc.)

## SSL Certificate

Use Let's Encrypt for free SSL:
```bash
certbot certonly --standalone -d yourdomain.com
```

## Database Backup

Configure automated backups:
- AWS RDS: Enable automated backups
- PostgreSQL: Use pg_dump with cron
- Schedule daily backups to S3/cloud storage

## Monitoring & Logging

- Set up error tracking (Sentry)
- Configure logging (Papertrail, CloudWatch)
- Monitor performance (New Relic, Datadog)
- Set up alerts for errors

## Performance Optimization

- Enable gzip compression
- Use CDN for static files
- Configure cache headers
- Optimize database queries
- Use connection pooling
- Enable Redis caching (optional)
"""
