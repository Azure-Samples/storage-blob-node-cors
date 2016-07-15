---
services: storage
platforms: nodejs
author: dineshmurthy
---

# Getting Started with CORS for the Windows Azure Storage Services in Node.js

Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the resource originated.
This sample demostrates how to enable Cors for the Blob Storage and Table services in Windows Azure, a how to perform the following tasks,

1. Upload and download files from the storage using javascript in a web browser.
2. Insert and query data from a table using javascript in a web browser. 

If you don't have a Microsoft Azure subscription you can
get a FREE trial account [here](http://go.microsoft.com/fwlink/?LinkId=330212)

**Note: This sample will overwrite any existing CORS rules in the Azure Subscription you use. No cleanup is done after the sample is run.**

## Running this sample

This sample can be run using either the Azure Storage Emulator that installs as part of the Azure SDK (In Windows only) - or by
updating the app.config file the storage connection string.

To run the sample using the Storage Emulator (Azure SDK):

1. Download and Install the Azure Storage Emulator [here](http://azure.microsoft.com/en-us/downloads/).
2. Start the Azure Storage Emulator (once only) by pressing the Start button or the Windows key and searching for it by typing "Azure Storage Emulator". Select it from the list of applications to start it.
3. Open the app.config file and set the configuration for the emulator ("useDevelopmentStorage":true).
4. Download the dependencies with *npm install*.
5. Run the sample by: node ./app.js

To run the sample using the Storage Service

1. Open the app.config file and set the connection string for the emulator ("useDevelopmentStorage":false) and set the connection string for the storage service ("connectionString":"...")
2. Create a Storage Account through the Azure Portal
3. Provide your connection string for the storage service ("connectionString":"...") in the app.config file. 
4. Download the dependencies with *npm install*.
5. Run the sample by: node ./app.js

## More information
- [Introducing Cors](https://blogs.msdn.microsoft.com/windowsazurestorage/2014/02/03/windows-azure-storage-introducing-cors/)
- [Delegating Access with Shared Access Signatures](http://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-shared-access-signature-part-1/)
- [Storage Emulator](https://azure.microsoft.com/en-us/documentation/articles/storage-use-emulator/)
