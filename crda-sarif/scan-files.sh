
CRDA_DIR=/crda-sarif

CRDA=$CRDA_DIR/crda  
echo $0 called with  $1, token $2 

FILE=$(pwd)/$1
SNYK_TOKEN=$2

if [ -z $3 ]
then
    OUTPUT=output.sarif 
else
    OUTPUT=$3 
fi

 
npm install

echo running  $CRDA  auth -t $SNYK_TOKEN 
$CRDA  auth -t $SNYK_TOKEN  >hide-auth.txt
rm hide-auth.txt 
echo running  $CRDA analyse -j $FILE
$CRDA analyse -j --verbose  $FILE  > crda.json

echo crda.json generated 
cat crda.json  
echo node $CRDA_DIR/convert.js crda.json $OUTPUT 
node $CRDA_DIR/convert.js crda.json $OUTPUT 