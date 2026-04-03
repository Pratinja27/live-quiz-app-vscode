@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup script for Windows
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET "MVN_CMD=mvn") ELSE (SET "MVN_CMD=%__MVNW_ARG0_NAME__%")
@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
@SET DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar

@SET JAVA_HOME_SAFE=%JAVA_HOME%
@IF "%JAVA_HOME_SAFE%"=="" (
  ECHO Error: JAVA_HOME is not set. Please install JDK 17+ and set JAVA_HOME.
  EXIT /B 1
)

@SET JAVACMD="%JAVA_HOME_SAFE%\bin\java.exe"

@IF NOT EXIST %WRAPPER_JAR% (
  ECHO Downloading Maven Wrapper...
  powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile %WRAPPER_JAR%"
)

@%JAVACMD% ^
  %MAVEN_OPTS% ^
  -classpath %WRAPPER_JAR% ^
  "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" ^
  %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
