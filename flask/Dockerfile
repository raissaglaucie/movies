FROM python:3.9-slim AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt .

# Install dependencies from requirements.txt (build stage)
RUN pip install --no-cache-dir -r requirements.txt

# Step 2: Final stage (runtime)
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only the installed packages from the build stage
COPY --from=build /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Copy the rest of your application code into the container
COPY . .

# Expose the port your app will run on
EXPOSE 5000

# Command to run your application
CMD ["python", "app.py"]