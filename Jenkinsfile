pipeline {
  environment {
    registry = "renovitetechnologies/reno-secure-ui-features-backend-sandbox"
    registryCredential = 'dockerhub'
    dockerImage = ''
  }
  agent any
  stages {
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build("renovitetechnologies/reno-secure-ui-features-backend-sandbox:v1","--build-arg username=praveenraturi --build-arg password=1l9o9v4eyes .")
        }
      }
    }
    stage('Deploying Image') {
      steps{
        script {
          withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'praveenraturi', passwordVariable: 'pRoi0@21')]) {
            docker.withRegistry( '', registryCredential ) {
              dockerImage.push()
            }
          }
        }
      }
    }
    stage('Remove Unused docker image') {
      steps{
        sh "docker rmi $registry:v2"
      }
    }
  }
}