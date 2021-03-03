
CRDA=/crda-sarif/crda 
 
echo running  $CRDA  auth -t $SNYK_TOKEN 
$CRDA  auth -t $SNYK_TOKEN
FILE=$(pwd)/package.json 
echo file asked for is $1, using $FILE

echo running  $CRDA analyse -j $FILE
$CRDA analyse -j --verbose  $FILE  > crda.json

echo json generated 
cat crda.json  
node convert.js crda.json