
CRDA Scan and Convert to Sarif

[![CI](https://github.com/jduimovich/crda-sarif-poc/actions/workflows/ci.yml/badge.svg)](https://github.com/jduimovich/crda-sarif-poc/actions/workflows/ci.yml)

This action is designed to scan a repository using CRDA and then convert to SARIF for use with Github Security Scanning Facility.

This is a PoC/WIP

The converted sarif file is uploaded using  github/codeql-action/upload-sarif@v1  

Simple usage is here 

``` 
name: CI
on: [push]  
jobs:
  test:
    runs-on: ubuntu-latest
    name: Merge Sarif Files for github scans
    steps: 
      - name: Checkout
        uses: actions/checkout@v2 
      - name: Run CRDA and Convert to Sarif
        uses: jduimovich/crda-sarif-poc@main 
        with:
          input-file-name: package.json
          snyk-token: ${{ secrets.SNYK_TOKEN }}
          output-file-name: output.sarif
      - name: CRDA Sarif View
        run: |  
          cat output.sarif  | jq 
      - name: Upload result to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v1
        with:
          sarif_file: output.sarif
      - name: Save Intermediate files
        run: |  
          mkdir -p uploads
          mv output.sarif uploads 
          mv crda.json uploads 
      - name: Upload merged Results  
        uses: actions/upload-artifact@v2
        with: 
          name: workfiles
          path: ./uploads
```
