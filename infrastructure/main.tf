provider {
  profile = "default"
  region = "us-east-1"
}


/**
* The VPC is the private cloud that provides the network infrastructure into
* which we can launch our aws resources.  This is effectively the root of our
* private network.
*/
resource "aws_vpc" "main" {
  cidr_block = "172.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_vpc.main"
  }
}

/**
* Provides a connection between the VPC and the public internet, allowing
* traffic to flow in and out of the VPC and translating IP addresses to public
* addresses.
*/
resource "aws_internet_gateway" "main_gateway" {
  vpc_id = aws_vpc.main.id

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_internet_gateway.main_gateway"
  }
}

/**
* An elastic IP address to be used by the NAT Gateway defined below.  The NAT
* gateway acts as a gateway between our private subnets and the public
* internet, providing access out to the internet from with in those subnets,
* while denying access in to them from the public internet.  This IP address
* acts as the IP address from which all the outbound traffic from the private
* subnets will originate.
*/
resource "aws_eip" "nat_gateway" {
  vpc = true

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_eip.nat_gateway"
  }
}

/**
* A public subnet with in our VPC that we can launch resources into that we
* want to be auto-assigned public ip addresses.  These resources will be
* exposed to the public internet, with public IPs, by default.  They don't need
* to go through, and aren't shielded by, the NAT Gateway.
*/
resource "aws_subnet" "public" {
  vpc_id = aws_vpc.grocery_run.id
  availability_zone = "us-east-1a"
  cidr_block = "172.1.0.0/24"
  map_public_ip_on_launch = true

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_subnet.public"
  }
}

/**
* A NAT Gateway that lives in our public subnet and provides an interface
* between our private subnets and the public internet.  It allows traffic to
* exit our private subnets, but prevents traffic from entering them.
*/
resource "aws_nat_gateway" "gateway" {
  allocation_id = aws_eip.nat_gateway.id
  subnet_id = aws_subnet.grocery_run_public.id

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_nat_gateway.gateway"
  }
}

resource "aws_subnet" "private" {
  vpc_id = aws_vpc.grocery_run.id
  availability_zone = "us-east-1a"
  cidr_block = "172.2.0.0/24"

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_subnet.private"
  }
}

resource "aws_ecs_cluster" "grocery_run" {
  name="grocery_run_cluster"
}

resource "aws_ecs_service" "grocery_run" {

}



