# Deployment Guide for AmhaChat Backend

## Prerequisites

1.  **Google Cloud Project**:
    *   Go to [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a new project (e.g., `amhachat-hackathon`).
    *   **Note your Project ID** (it might be different from the name, e.g., `amhachat-hackathon-12345`).

2.  **Billing**:
    *   Ensure billing is enabled for your project. (You get $300 free credits for new accounts).

3.  **Google Cloud CLI (gcloud)**:
    *   Install the SDK if you haven't: [Install Link](https://cloud.google.com/sdk/docs/install)
    *   Login locally:
        ```bash
        gcloud auth login
        gcloud auth application-default login
        ```

## Deployment Steps

I have created an automated script `deploy.sh` to handle everything for you.

1.  **Open Terminal** in the `backend` folder.
2.  **Run the script**:
    ```bash
    ./deploy.sh
    ```
3.  **Follow the prompts**:
    *   Enter your **Project ID** when asked.
    *   Wait for the script to enable APIs, create the bucket, and deploy the Cloud Run service.

## Manual Deployment (if script fails)

If the script doesn't work, run these commands manually:

1.  **Set Project**:
    ```bash
    gcloud config set project YOUR_PROJECT_ID
    ```

2.  **Enable APIs**:
    ```bash
    gcloud services enable cloudbuild.googleapis.com run.googleapis.com aiplatform.googleapis.com texttospeech.googleapis.com storage.googleapis.com firestore.googleapis.com
    ```

3.  **Create Bucket**:
    ```bash
    gsutil mb -l us-central1 gs://YOUR_PROJECT_ID-amhazon-storage
    ```

4.  **Deploy**:
    ```bash
    gcloud run deploy amhachat-backend \
        --source . \
        --platform managed \
        --region us-central1 \
        --allow-unauthenticated \
        --set-env-vars GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID,STORAGE_BUCKET=YOUR_PROJECT_ID-amhazon-storage
    ```

## Post-Deployment

*   Your backend URL will be shown at the end (e.g., `https://amhachat-backend-xxxxx-uc.a.run.app`).
*   **Save this URL**. You will need it for the Frontend.
