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

/******************************************************************************
* Public Subnet 
*******************************************************************************/

/**
* A public subnet with in our VPC that we can launch resources into that we
* want to be auto-assigned public ip addresses.  These resources will be
* exposed to the public internet, with public IPs, by default.  They don't need
* to go through, and aren't shielded by, the NAT Gateway.
*/
resource "aws_subnet" "public_subnet" {
  vpc_id = var.vpc_id 
  availability_zone = var.availability_zone 
  cidr_block = "${var.cidr_block_prefix}.${var.public_cidr_block_postfix}/24"
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
  vpc_id = var.vpc_id 

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
  gateway_id = var.internet_gateway_id 
}

/**
* Associate the public route table with the public subnet.
*/
resource "aws_route_table_association" "public_route_table_to_public_subnet_association" {
  subnet_id = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_route_table.id
}


/******************************************************************************
* Private Subnet 
*******************************************************************************/

/** 
* A private subnet for pieces of the infrastructure that we don't want to be
* directly exposed to the public internet.  Infrastructure launched into this
* subnet will not have public IP addresses, and can access the public internet
* only through the route to the NAT Gateway.
*/
resource "aws_subnet" "private_subnet" {
  vpc_id = var.vpc_id 
  availability_zone = var.availability_zone 
  cidr_block = "${var.cidr_block_prefix}.${var.private_cidr_block_postfix}/24"

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
  vpc_id = var.vpc_id 

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
