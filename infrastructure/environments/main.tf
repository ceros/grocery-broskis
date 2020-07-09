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

/**
* An elastic IP address to be used by the NAT Gateway defined below.  The NAT
* gateway acts as a gateway between our private subnets and the public
* internet, providing access out to the internet from with in those subnets,
* while denying access in to them from the public internet.  This IP address
* acts as the IP address from which all the outbound traffic from the private
* subnets will originate.
*/
resource "aws_eip" "eip_for_the_nat_gateway" {
  vpc = true

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_eip.eip_for_the_nat_gateway"
  }
}

/**
* A public subnet with in our VPC that we can launch resources into that we
* want to be auto-assigned public ip addresses.  These resources will be
* exposed to the public internet, with public IPs, by default.  They don't need
* to go through, and aren't shielded by, the NAT Gateway.
*/
resource "aws_subnet" "public_subnet" {
  vpc_id = aws_vpc.main_vpc.id
  availability_zone = "us-east-1a"
  cidr_block = "172.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_subnet.public_subnet"
  }
}

/**
* A NAT Gateway that lives in our public subnet and provides an interface
* between our private subnets and the public internet.  It allows traffic to
* exit our private subnets, but prevents traffic from entering them.
*/
resource "aws_nat_gateway" "nat_gateway" {
  allocation_id = aws_eip.eip_for_the_nat_gateway.id
  subnet_id = aws_subnet.public_subnet.id

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_nat_gateway.nat_gateway"
  }
}

/**
* A public route table.
*/
resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_route_table.public_route_table"
  }
}

/**
* A route from the public route table out to the internet through the internet
* gateway.
*/
resource "aws_route" "route_from_public_route_table_to_internet" {
  route_table_id = aws_route_table.public_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id = aws_internet_gateway.main_internet_gateway.id
}

/**
* Associate the public route table with the public subnet.
*/
resource "aws_route_table_association" "public_route_table_to_public_subnet_association" {
  subnet_id = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}

/** 
* A private subnet for pieces of the infrastructure that we don't want to be
* directly exposed to the public internet.  Infrastructure launched into this
* subnet will not have public IP addresses, and can access the public internet
* only through the route to the NAT Gateway.
*/
resource "aws_subnet" "private_subnet" {
  vpc_id = aws_vpc.main_vpc.id
  availability_zone = "us-east-1a"
  cidr_block = "172.0.2.0/24"

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_subnet.private_subnet"
  }
}

/**
* A route table for the private subnet.
*/
resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.main_vpc.id

  tags = {
    Application = "grocery_run"
    Environment = "production"
    Resource = "aws_route_table.private_route_table"
  }
}

/**
* A route from the private route table out to the internet through the NAT  
* Gateway.
*/
resource "aws_route" "route_from_private_route_table_to_internet" {
  route_table_id = aws_route_table.private_route_table.id
  destination_cidr_block = "0.0.0.0/0"
  nat_gateway_id = aws_nat_gateway.nat_gateway.id
}


/**
* Associate the private route table with the private subnet.
*/
resource "aws_route_table_association" "private_route_table_to_private_subnet_association" {
  subnet_id = aws_subnet.private_subnet.id
  route_table_id = aws_route_table.private_route_table.id
}

