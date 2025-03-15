resource "aws_vpc" "vpc" {
  cidr_block = "10.0.0.0/16"
}

resource "aws_subnet" "subnet" {
  vpc_id     = aws_vpc.vpc.id
  cidr_block = "10.0.1.0/24"

  tags = var.tags_terraform
}

resource "aws_route_table" "rta" {
  vpc_id = aws_vpc.vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "Terraform"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "Terraform"
  }
}

resource "aws_route_table_association" "rta_association" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.rta.id
}

resource "aws_security_group" "nsg_aws" {
  # ... other configuration ...
  vpc_id = aws_vpc.vpc.id
  egress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
  }
  
  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 8080
    to_port     = 8080
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 5000
    to_port     = 5000
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "Terraform"
  }
}

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

  provisioner "local-exec" {
    command = "ls && pwd"
  }

  provisioner "file" {
    source      = "./docker.sh"
    destination = "/home/ubuntu/docker.sh"
  }

  provisioner "file" {
    source      = "../docker-compose.yml"
    destination = "/home/ubuntu/docker-compose.yml"
  }
}

output "ec2_public_ip" {
  value = aws_instance.vm_aws.public_ip
}


resource "aws_key_pair" "key" {
  key_name   = "aws_key"
  public_key = file("./aws_key.pub")
}