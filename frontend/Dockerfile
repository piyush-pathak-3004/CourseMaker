# frontend/Dockerfile
FROM node:16 AS builder

WORKDIR /app

# Accept build arguments
ARG REACT_APP_AUTH0_DOMAIN
ARG REACT_APP_AUTH0_AUDIENCE
ARG REACT_APP_AUTH0_CLIENT_ID

# DEBUG: Print the build args
RUN echo "=== BUILD ARGS DEBUG ==="
RUN echo "REACT_APP_AUTH0_DOMAIN: $REACT_APP_AUTH0_DOMAIN"
RUN echo "REACT_APP_AUTH0_AUDIENCE: $REACT_APP_AUTH0_AUDIENCE" 
RUN echo "REACT_APP_AUTH0_CLIENT_ID: $REACT_APP_AUTH0_CLIENT_ID"

# Set them as environment variables for the build
ENV REACT_APP_AUTH0_DOMAIN=$REACT_APP_AUTH0_DOMAIN
ENV REACT_APP_AUTH0_AUDIENCE=$REACT_APP_AUTH0_AUDIENCE
ENV REACT_APP_AUTH0_CLIENT_ID=$REACT_APP_AUTH0_CLIENT_ID

# DEBUG: Print the env vars
RUN echo "=== ENVIRONMENT VARIABLES ==="
RUN echo "REACT_APP_AUTH0_DOMAIN: $REACT_APP_AUTH0_DOMAIN"
RUN echo "REACT_APP_AUTH0_AUDIENCE: $REACT_APP_AUTH0_AUDIENCE"
RUN echo "REACT_APP_AUTH0_CLIENT_ID: $REACT_APP_AUTH0_CLIENT_ID"

COPY package*.json ./
RUN npm install

COPY . .

# DEBUG: Check if .env file exists in the container
RUN echo "=== CHECKING .env FILE ==="
RUN ls -la .env || echo "No .env file found"
RUN cat .env || echo "Cannot read .env file"

# Build the React app
RUN npm run build

# DEBUG: Check if variables made it into the build
RUN echo "=== CHECKING BUILD OUTPUT ==="
RUN find build/static/js -name "*.js" -exec grep -l "dev-4as2v704ltyjd0f8" {} \; || echo "Domain not found in build"

# Serve with nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]