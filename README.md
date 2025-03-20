# 🎬 DevOps Assessment III: MOVIES

## 🌐 Live Demo

Visit the live application at: [Click Here](http://3.144.120.244)

---

## 🚀 Getting Started

### Prerequisites

To run the movie code app in your environment, ensure you have the following:

- **Git** installed
- **Docker & Docker Compose** installed  
  - If using **Linux** and it's not installed, run the `docker.sh` script.
  - If using **Windows**, follow the official installation guide:  
    [Docker for Windows](https://docs.docker.com/desktop/setup/install/windows-install/).

---

### 📥 Cloning the Repository

1. Create a new folder for the project.
2. Initialize Git inside the folder:
   ```sh
   git init
   ```
3. Clone the repository:
git clone https://github.com/raissaglaucie/movies


## 🛠️ Setup & Configuration

### 🔧 Environment Variables
Before proceeding, update the `.env` file inside the nginx/reactApp folder.

This file is automatically populated by the CI/CD pipeline.
Since we are manually uploading our code, update it yourself:

Create the following environment variables

```env
AWS_ACCESS_KEY_ID=<your_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_secret_access_key>
AWS_SSH_KEY=<your_aws_ssh_key>
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
DOCKER_PASSWORD=<your_docker_password>
SONAR_TOKEN=<your_sonar_token>

```
   
## 🐳 Building & Running the Containers
### 1️⃣ Build the Docker Images

Navigate to the flask and nginx/reactApp directories and build the images:
```
cd ./flask
docker build -t <image-name> .
```

Repeat for the React frontend:
```
cd ../nginx/reactApp
docker build -t <image-name> .
```

### 2️⃣ Update docker-compose.yml

Modify docker-compose.yml to reflect your image names:

```
react:
  image: <image-name>
  container_name: react
  expose:
    - "80"
  ports:
    - "80:80"
  networks:
    - my_network
```

### 3️⃣ Run the Application

Start the containers:
```
docker compose up
```

Test the application by attempting to update the movies.

### 4️⃣ Stopping the Application

To stop the server:

```
Ctrl + C
```
To remove all containers:

```
docker compose down
```

## ☁️ Deploying with Terraform

### 🔑 Generating SSH Keys
Navigate to the terraform directory and generate RSA keys:
```
ssh-keygen -t rsa -b 4096
```
Name the key: aws_key
### 🔨 Infrastructure as Code (Terraform)
Modify Terraform to pass the docker.sh script for remote execution:

```
resource "aws_instance" "vm_aws" {
  ami                         = "ami-0e2c8caa4b6378d8c"
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.subnet.id
  key_name                    = aws_key_pair.key.key_name
  tags                        = var.tags_terraform
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.nsg_aws.id]

  connection {
    type        = "ssh"
    user        = "ubuntu"
    private_key = file("./aws_key")
    host        = self.public_ip
  }

  provisioner "file" {
    source      = "docker.sh"
    destination = "/home/ubuntu/docker.sh"
  }

  provisioner "file" {
    source      = "C:/Alunos/Raissa/docker-compose.yml"
    destination = "/home/ubuntu/docker-compose.yml"
  }

  provisioner "remote-exec" {
    inline = [
      "sed -i 's/\r$//' /home/ubuntu/docker.sh",
      "chmod +x /home/ubuntu/docker.sh",
      "export PUBLIC_IP=${self.public_ip}",
      "/home/ubuntu/docker.sh"
    ]
  }
}
```

## 🏗️ Deploying Infrastructure
Navigate to the terraform folder:
```
cd terraform
```
Initialize Terraform:
```
terraform init
```
Plan the deployment:
```
terraform plan --out <plan-file>
```
Apply the plan:
```
terraform apply <plan-file>
```
## 🎭 Testing the Application

After deployment, the frontend and backend will be up and running.

However, since the .env file uses localhost, update it locally:

```
VITE_API_URL=http://<EC2_IP>:5000
```
Do not update this on EC2.
Instead, build the image locally and test it via Postman or Insomnia.

## 🏗️ Architecture Overview

- Backend: Flask (port 5000)
- Frontend: React with Vite (port 80)
- Infrastructure: AWS EC2, Docker, Terraform


