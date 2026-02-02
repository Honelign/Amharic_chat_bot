#!/bin/bash

echo "Building frontend..."
npm run build

echo "Deploying to Firebase..."
firebase deploy --only hosting
