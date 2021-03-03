# Minimal curl tool needed 
FROM alpine     
RUN apk --no-cache add ca-certificates dos2unix npm 

# Repository script can be run inside and shell or container (with curl)
RUN mkdir /crda-sarif  
COPY scan-files.sh /crda-sarif/scan-files.sh 
COPY convert.js /crda-sarif/convert.js
COPY crda /crda-sarif/crda
RUN chmod +x /crda-sarif/crda 
RUN dos2unix /crda-sarif/scan-files.sh 

WORKDIR /scan  
ENTRYPOINT ["/bin/sh", "/crda-sarif/scan-files.sh"]