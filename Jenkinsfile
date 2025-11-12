pipeline {
  agent any

  environment {
    REGISTRY = 'bhargav1605' // e.g. docker.io/youruser
    BACKEND_IMAGE = "${env.REGISTRY}/todo-backend:${env.BUILD_NUMBER}"
    FRONTEND_IMAGE = "${env.REGISTRY}/todo-frontend:${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Backend') {
      steps {
        dir('backend') {
          // Windows CMD syntax for env variables
          bat "docker build -t %BACKEND_IMAGE% ."
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          bat "docker build -t %FRONTEND_IMAGE% ."
        }
      }
    }

    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          // CMD syntax again — note the use of %VAR% and escaping pipe
          bat '''
          echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
          docker push %BACKEND_IMAGE%
          docker push %FRONTEND_IMAGE%
          '''
        }
      }
    }

    stage('Notify Faculty') {
      steps {
        script {
          emailext (
            subject: "Todo App Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
            body: """Build ${env.BUILD_NUMBER} finished with status ${currentBuild.currentResult}.
                     Build URL: ${env.BUILD_URL}
                     Backend image: ${env.BACKEND_IMAGE}
                     Frontend image: ${env.FRONTEND_IMAGE}""",
            to: 'mattabhargav.05@gmail.com'
          )
        }
      }
    }
    stage('Deploy to Server') {
  steps {
    bat '''
    docker pull bhargav1605/todo-backend:%BUILD_NUMBER%
    docker pull bhargav1605/todo-frontend:%BUILD_NUMBER%
    docker-compose -f deploy/docker-compose.yml up -d
    '''
  }
}
  }

  post {
    success {
      echo "SUCCESS: ${env.BUILD_URL}"
    }
    failure {
      echo "FAILED: ${env.BUILD_URL}"
    }
  }
}
