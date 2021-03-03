
CRDA=/crda-sarif/crda  
echo $0 called with  $1, token $2 

FILE=$(pwd)/$1
SNYK_TOKEN=$2
 
echo running  $CRDA  auth -t $SNYK_TOKEN 
$CRDA  auth -t $SNYK_TOKEN  >hide-auth.txt

echo running  $CRDA analyse -j $FILE
$CRDA analyse -j --verbose  $FILE  > crda.json

echo crda.json generated 
cat crda.json  
echo converting crda file to sarif
node convert.js crda.json