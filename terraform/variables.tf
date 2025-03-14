variable "tags" {
  description = "terraform tags"
  type        = map(string)
  default = {
    "Env" = "DEV",
    "IaC" = "Terraform"
  }
}

variable "tags_terraform" {
  default = {
    "Name" = "Terraform"
  }
  type = map(string)
}