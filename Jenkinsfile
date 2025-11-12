pipeline {
  agent any
  environment {
    REGISTRY = 'your-docker-registry' // e.g. docker.io/youruser
    BACKEND_IMAGE = "${env.REGISTRY}/todo-backend:${env.BUILD_NUMBER}"
    FRONTEND_IMAGE = "${env.REGISTRY}/todo-frontend:${env.BUILD_NUMBER}"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Build Backend') {
      steps {
        dir('backend') {
          bat 'docker build -t $BACKEND_IMAGE .'
        }
      }
    }
    stage('Build Frontend') {
      steps {
        dir('frontend') {
          bat 'docker build -t $FRONTEND_IMAGE .'
        }
      }
    }
    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          bat 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
          bat 'docker push $BACKEND_IMAGE'
          bat 'docker push $FRONTEND_IMAGE'
        }
      }
    }
    stage('Notify Faculty') {
      steps {
        script {
          // Option A: Use Jenkins email extension (requires plugin)
          emailext (
            subject: "Todo App Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
            body: """Build ${env.BUILD_NUMBER} finished with status ${currentBuild.currentResult}. 
                     Build URL: ${env.BUILD_URL}
                     Backend image: ${env.BACKEND_IMAGE}
                     Frontend image: ${env.FRONTEND_IMAGE}""",
            to: 'faculty@example.edu'
          )
          // Option B: If emailext is not available, you can use curl to send webhook (Slack/Teams/custom)
          // sh "curl -X POST -H 'Content-type: application/json' --data '{\"text\":\"Build ${env.BUILD_NUMBER} finished: ${currentBuild.currentResult} - ${env.BUILD_URL}\"}' https://hooks.example/webhook"
        }
      }
    }
  }
  post {
    success { echo "SUCCESS: ${env.BUILD_URL}" }
    failure { echo "FAILED: ${env.BUILD_URL}" }
  }
}
