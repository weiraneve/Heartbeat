#!/bin/bash
set -euo pipefail

# shellcheck source=/dev/null
source ./ops/base.sh

display_help() {
  echo "Usage: $0 {infra|e2e|stub|prod}" >&2
  echo
  echo "   infra    deploy infra file"
  echo "   stub     deploy stub"
  echo "   e2e      deploy application to the e2e env"
  echo "   prod     deploy application to the prod env"
  echo
  exit 1
}
deploy_infra() {
  sh ./ops/infra/updateAwsResource.sh
}

deploy_e2e() {
  sed -i -e "s/heartbeat_backend:latest/${AWS_ECR_HOST}\/heartbeat_backend:latest/g" ./ops/infra/docker-compose.yml
  sed -i -e "s/heartbeat_frontend:latest/${AWS_ECR_HOST}\/heartbeat_frontend:latest/g" ./ops/infra/docker-compose.yml

  scp -o StrictHostKeyChecking=no -i /var/lib/buildkite-agent/.ssh/HeartBeatKeyPair.pem -P "${AWS_SSH_PORT}" ./ops/infra/docker-compose.yml "${AWS_USERNAME}@${AWS_EC2_IP_E2E}:./"

  echo "Start to deploy e2e service"
  ssh -o StrictHostKeyChecking=no -i /var/lib/buildkite-agent/.ssh/HeartBeatKeyPair.pem -p "${AWS_SSH_PORT}" "${AWS_USERNAME}@${AWS_EC2_IP_E2E}" "
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ECR_HOST}
    if [ -n \"\$(docker images -f label=arch=Backend -q)\" ]; then
        docker rmi -f \$(docker images -f label=arch=Backend -q)
    fi
    if [ -n \"\$(docker images -f label=arch=Frontend -q)\" ]; then
        docker rmi -f \$(docker images -f label=arch=Frontend -q)
    fi

    docker pull ${AWS_ECR_HOST}/heartbeat_backend:latest
    docker pull ${AWS_ECR_HOST}/heartbeat_frontend:latest

    export MOCK_SERVER_URL=${AWS_EC2_IP_MOCK_SERVER}:${AWS_EC2_IP_MOCK_SERVER_PORT}
    export SPRING_PROFILES_ACTIVE=e2e
    docker-compose up -d frontend
  "
  echo "Successfully deployed e2e service"
}

deploy_stub() {
  sed -i -e "s/heartbeat_stub:latest/${AWS_ECR_HOST}\/heartbeat_stub:hb${BUILDKITE_BUILD_NUMBER}/g" ./ops/infra/docker-compose.yml

  scp -o StrictHostKeyChecking=no -i /var/lib/buildkite-agent/.ssh/HeartBeatKeyPair.pem -P "${AWS_SSH_PORT}" ./ops/infra/docker-compose.yml "${AWS_USERNAME}@${AWS_EC2_IP_MOCK_SERVER}":./docker-compose-stub.yml

  echo "Start to deploy stub service"
  ssh -o StrictHostKeyChecking=no -i /var/lib/buildkite-agent/.ssh/HeartBeatKeyPair.pem -p "${AWS_SSH_PORT}" "${AWS_USERNAME}@${AWS_EC2_IP_MOCK_SERVER}" "
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ECR_HOST}
    if [ -n \"\$(docker images -f label=arch=stubs -q)\" ]; then
      docker stop \$(docker ps -aq -f label=arch=stubs)
      docker rm \$(docker ps -aq -f label=arch=stubs)
      docker rmi -f \$(docker images -f label=arch=stubs -q)
    fi

    docker pull ${AWS_ECR_HOST}/heartbeat_stub:hb${BUILDKITE_BUILD_NUMBER}

    docker-compose stop stub

    export MOCK_SERVER_PORT=${AWS_EC2_IP_MOCK_SERVER_PORT}
    docker-compose -f docker-compose-stub.yml up -d stub
  "
  echo "Successfully deployed stub service"
}

deploy_prod() {
  sed -i -e "s/heartbeat_backend:latest/${AWS_ECR_HOST}\/heartbeat_backend:latest/g" ./ops/infra/docker-compose.yml
  sed -i -e "s/heartbeat_frontend:latest/${AWS_ECR_HOST}\/heartbeat_frontend:latest/g" ./ops/infra/docker-compose.yml

  scp -o StrictHostKeyChecking=no -i /var/lib/buildkite-agent/.ssh/HeartBeatKeyPair.pem -P "${AWS_SSH_PORT}" ./ops/infra/docker-compose.yml "${AWS_USERNAME}@${AWS_EC2_IP}:./"

  ssh -o StrictHostKeyChecking=no -i /var/lib/buildkite-agent/.ssh/HeartBeatKeyPair.pem -p "${AWS_SSH_PORT}" "${AWS_USERNAME}@${AWS_EC2_IP}" "
    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ECR_HOST}
    if [ -n \"\$(docker images -f label=app=Heartbeat -q)\" ]; then
        docker rmi -f \$(docker images -f label=app=Heartbeat -q)
    fi
    docker pull ${AWS_ECR_HOST}/heartbeat_backend:latest
    docker pull ${AWS_ECR_HOST}/heartbeat_frontend:latest
    docker-compose up -d frontend
  "
}

if [[ "$#" -le 0 ]]; then
  display_help
fi

while [[ "$#" -gt 0 ]]; do
  case $1 in
  -h | --help) display_help ;;
  infra) deploy_infra ;;
  e2e) deploy_e2e ;;
  stub) deploy_stub ;;
  prod) deploy_prod ;;
  *) echo "Unknown parameter passed: $1" ;;
  esac
  shift
done
