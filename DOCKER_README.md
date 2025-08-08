# Docker Instructions for AI Dzinly React App

This document provides instructions for building and running the AI Dzinly React application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, for easier management)

## Building the Docker Image

### Option 1: Using Docker directly

```bash
# Build the Docker image
docker build -t ai-dzinly:latest .

# Run the container
docker run -p 3000:80 ai-dzinly:latest
```

### Option 2: Using Docker Compose

```bash
# Build and run the production version
docker-compose up --build

# For development (with hot reload)
docker-compose --profile dev up --build ai-dzinly-dev
```

## Accessing the Application

Once the container is running, you can access the application at:
- Production: http://localhost:3000
- Development: http://localhost:5173

## Docker Files Explanation

### Dockerfile
- **Multi-stage build**: Uses Node.js Alpine for building and Nginx Alpine for serving
- **Build stage**: Installs dependencies and builds the React app using Vite
- **Production stage**: Serves the built app using Nginx

### .dockerignore
- Excludes unnecessary files from the Docker build context
- Reduces build time and image size

### nginx.conf
- Custom Nginx configuration for serving the React SPA
- Handles client-side routing (React Router)
- Enables gzip compression
- Sets security headers
- Configures static asset caching

### docker-compose.yml
- **Production service**: Builds and runs the production version
- **Development service**: Runs with hot reload (use with `--profile dev`)

## Environment Variables

If your app uses environment variables, create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

For Docker deployment, you can pass environment variables using:

```bash
docker run -p 3000:80 --env-file .env ai-dzinly:latest
```

Or in docker-compose.yml:

```yaml
environment:
  - VITE_API_URL=${VITE_API_URL}
  - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
```

## Optimization Tips

1. **Multi-stage builds**: The Dockerfile uses multi-stage builds to reduce final image size
2. **Layer caching**: Dependencies are copied before source code for better layer caching
3. **Alpine images**: Uses Alpine Linux for smaller image sizes
4. **Nginx**: Optimized for serving static React apps

## Troubleshooting

### Build Issues
- Ensure all dependencies are listed in package.json
- Check if the build command `npm run build` works locally
- Verify Node.js version compatibility

### Runtime Issues
- Check if environment variables are properly set
- Ensure the app builds successfully before containerizing
- Verify port mappings in Docker run command

### Performance Issues
- Enable gzip compression (already configured in nginx.conf)
- Use CDN for static assets in production
- Optimize bundle size using Vite's build analyzer
