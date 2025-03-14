terraform {
  required_version = ">=1.3.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }


  backend "s3" {
    bucket = "raissa-bucket-fl"
    key    = "state/terraform.tfstate"
    region = "us-east-2"
  }

}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-2"
}