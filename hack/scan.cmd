@echo off
docker build  -t jduimovich/crda-sarif . 

rem docker run -it --env SNYK_TOKEN=%SNYK_TOKEN%   --entrypoint /bin/sh jduimovich/crda-sarif
 
docker run -it -v %CD%:/scan --env SNYK_TOKEN=%SNYK_TOKEN%   jduimovich/crda-sarif package.json %SNYK_TOKEN%  temp.sarif

more temp.sarif | jq 
more temp.sarif | jq  > crda.sarif
del temp.sarif