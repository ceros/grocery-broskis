variable vpc_id {
  type = string
  description = "The ID of the VPC we'll be launching this availability zone into."
}

variable internet_gateway_id {
  type = string
  description = "The ID of the internet gateway for the VPC."
}

variable availability_zone {
  type = string
  description = "The availability zone we'd like to create subnet infrastructure for."
}

variable cidr_block_prefix {
  type = string
  description = "The prefix of the CIDR Block we used for our VPC."
}

variable public_cidr_block_postfix {
  type = string
  description = "The postfix of the CIDR Block we'll use for the public subnet."
}

variable private_cidr_block_postfix {
  type = string
  description  = "The postfix of the CIDR block we'll use for the private subnet."
}
