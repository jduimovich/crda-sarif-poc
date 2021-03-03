# Minimal curl tool needed 
FROM alpine     
RUN apk --no-cache add ca-certificates dos2unix npm 

# Put all scripts into a directory that doesn't interfere with checkout
ADD crda-sarif  /crda-sarif   
RUN chmod +x /crda-sarif/crda 
RUN dos2unix /crda-sarif/scan-files.sh 

WORKDIR /scan  
ENTRYPOINT ["/bin/sh", "/crda-sarif/scan-files.sh"]