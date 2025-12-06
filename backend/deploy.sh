#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Deployment to Google Cloud Run..."

# check if gcloud is installed
if ! command -v gcloud &> /dev/null
then
    echo "❌ gcloud CLI could not be found. Please install it first."
    exit 1
fi

# Ask for Project ID
read -p "Enter your Google Cloud Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID cannot be empty."
    exit 1
fi

echo "✅ Using Project ID: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable APIs
echo "🔄 Enabling necessary APIs... (this might take a minute)"
gcloud services enable cloudbuild.googleapis.com \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    aiplatform.googleapis.com \
    texttospeech.googleapis.com \
    storage.googleapis.com \
    firestore.googleapis.com

# Create Storage Bucket
BUCKET_NAME="${PROJECT_ID}-amhazon-storage"
echo "📦 Creating Cloud Storage Bucket: gs://$BUCKET_NAME"

if gsutil ls -b gs://$BUCKET_NAME > /dev/null 2>&1; then
    echo "   -> Bucket already exists."
else
    gsutil mb -l us-central1 gs://$BUCKET_NAME
    echo "   -> Bucket created."
fi

# Make bucket public readable? No, better to keep it private and use signed URLs as implemented.
# But we need to give the Cloud Run service account permission to write to it.
# The default compute service account is usually used.

echo "🏗️  Building and Deploying to Cloud Run..."
gcloud run deploy amhachat-backend \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars GOOGLE_CLOUD_PROJECT=$PROJECT_ID,STORAGE_BUCKET=$BUCKET_NAME \
    --memory 1Gi

echo "🎉 Deployment Complete!"
echo "Check the URL above to access your backend."
