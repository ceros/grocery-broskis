/******************************************************************************
* VPC
*******************************************************************************/

/**
* The VPC is the private cloud that provides the network infrastructure into
* which we can launch our aws resources.  This is effectively the root of our
* private network.
*/
resource "aws_vpc" "main_vpc" {
  cidr_block = "172.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_vpc.main_vpc"
  }
}

/**
* Provides a connection between the VPC and the public internet, allowing
* traffic to flow in and out of the VPC and translating IP addresses to public
* addresses.
*/
resource "aws_internet_gateway" "main_internet_gateway" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_internet_gateway.main_internet_gateway"
  }
}

module "availability_zone_a" {
  source = "../modules/availability_zone"
  vpc_id = aws_vpc.main_vpc.id
  internet_gateway_id = aws_internet_gateway.main_internet_gateway.id
  availability_zone = "us-east-1a"
  cidr_block_prefix = "172.0"
  public_cidr_block_postfix = "1.0"
  private_cidr_block_postfix = "2.0"
}

module "availability_zone_c" {
  source = "../modules/availability_zone"
  vpc_id = aws_vpc.main_vpc.id
  internet_gateway_id = aws_internet_gateway.main_internet_gateway.id
  availability_zone = "us-east-1c"
  cidr_block_prefix = "172.0"
  public_cidr_block_postfix = "3.0"
  private_cidr_block_postfix =  "4.0"
}

/******************************************************************************
* RDS for MySQL Database 
*******************************************************************************/

/**
* Source our database parameters from SSM Parameter Store, so that we can
* protect them.
*/
data "aws_ssm_parameter" "database_root_username" {
  name = "/grocery_run/production/database/root/username"
}

data "aws_ssm_parameter" "database_root_password" {
  name = "/grocery_run/production/database/root/password"
}

data "aws_ssm_parameter" "database_name" {
  name = "/grocery_run/production/database/app/name"
}

/**
* A subnet group that places the database in our private subnet.
*/
resource "aws_db_subnet_group" "database_subnet_group" {
  name = "database_subnet_group"
  subnet_ids = [ module.availability_zone_a.private_subnet_id, module.availability_zone_c.private_subnet_id ]

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_db_subnet_group.database_subnet_group"
  }
}

/**
* TECHDEBT: there's no good way to initialize a new database with a mysql
* schema.  You can restore from snapshot, or a Percona XtraBackup, but not
* initalize from raw sql.  The only way to do that would be to run a script,
* either on the local machine or on an EC2 instance that logs into the database
* instance and initializes it.  That seems out of scope for this project, so
* I'm just gonna do it manually.
*
* Our RDS for MySQL database instance.  We don't need a very powerful database,
* given that this is just a prototype, so keeping it simple and small.
*/
resource "aws_db_instance" "database" {
  db_subnet_group_name = aws_db_subnet_group.database_subnet_group.id

  allocated_storage = 20
  storage_type = "gp2"
  engine = "mysql"
  engine_version = "5.7"
  instance_class = "db.t3.micro"

  name = data.aws_ssm_parameter.database_name.value
  username = data.aws_ssm_parameter.database_root_username.value
  password = data.aws_ssm_parameter.database_root_password.value

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_db_instance.database"
  }
}

