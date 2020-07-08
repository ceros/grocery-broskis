provider {
  profile="default"
  region="us-east-1"
}

resource "aws_vpc" "grocery_run" {

}

resource "aws_subnet" "grocery_run_public" {

}

resource "aws_subnet" "grocery_run_private" {

}

resource "aws_ecs_cluster" "grocery_run" {
  name="grocery_run_cluster"
}

resource "aws_ecs_service" "grocery_run" {

}



