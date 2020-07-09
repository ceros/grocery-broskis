provider "aws" {
  region = "us-east-1"
  shared_credentials_file = "/Users/danielbingham/.aws/credentials"
  profile = "default"
}

# The S3 bucket where we will store our Terraform state.
resource "aws_s3_bucket" "ceros_grocery_run_state" {
  bucket = "ceros-grocery-run-terraform-state"  

  # Enable versioning so we can see the full revision history of our
  # state files
  versioning {
    enabled = true
  }  

  # Enable server-side encryption by default
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

# The DynamoDB table we will use for state locks.
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "ceros_grocery_run_state_locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"  

  attribute {
    name = "LockID"
    type = "S"
  }
}

terraform {
  backend "s3" {
    bucket         = "ceros-grocery-run-terraform-state"
    key            = "backend-definition/terraform.tfstate"
    region         = "us-east-1"    
    dynamodb_table = "ceros_grocery_run_state_locks"
    encrypt        = true
  }

  required_version = "0.12.28"
}
