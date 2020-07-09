provider "aws" {
  region = "us-east-1"
  shared_credentials_file = "/Users/danielbingham/.aws/credentials"
  profile = "default"
}

terraform {
  backend "s3" {
    bucket         = "ceros-grocery-run-terraform-state"
    key            = "grocery-run-staging/terraform.tfstate"
    region         = "us-east-1"    
    dynamodb_table = "ceros_grocery_run_state_locks"
    encrypt        = true
  }

  required_version = "0.12.28"
}
