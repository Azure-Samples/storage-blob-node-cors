//----------------------------------------------------------------------------------
// Microsoft Developer & Platform Evangelism
//
// Copyright (c) Microsoft Corporation. All rights reserved.
//
// THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, 
// EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES 
// OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
//----------------------------------------------------------------------------------
// The example companies, organizations, products, domain names,
// e-mail addresses, logos, people, places, and events depicted
// herein are fictitious.  No association with any real company,
// organization, product, domain name, email address, logo, person,
// places, or events is intended or should be inferred.
//----------------------------------------------------------------------------------

var express = require('express');
var router = express.Router();
var storage = require('azure-storage');
var fs = require('fs');
var config = require('../config.js');

router.get('/listBlobs', function (req, res) {

  var cn = config.connectionString;
  var blobService = storage.createBlobService(cn);

  var url = blobService.getUrl(config.containerName);
  res.render('listBlobs', { title: 'List Blobs', containerName: config.containerName, url: url });
});

router.get('/', function (req, res) {

  res.render('uploadImage', { title: 'Upload Image', containerName: config.containerName });
});

router.get('/getBlobSasUrl', function (req, res) {

  var cn = config.connectionString;
  var blobService = storage.createBlobService(cn);

  var blockBlobName = "demoblockblob-" + req.query.blobName;

  var expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 30);

  var sharedAccessPolicy = {
    AccessPolicy: {
      Permissions: storage.BlobUtilities.SharedAccessPermissions.READ + storage.BlobUtilities.SharedAccessPermissions.WRITE + storage.BlobUtilities.SharedAccessPermissions.LIST,
      Expiry: expiryDate
    },
  };

  var sas = blobService.generateSharedAccessSignature(config.containerName, blockBlobName, sharedAccessPolicy);
  var sasUrl = blobService.getUrl(config.containerName, blockBlobName, sas);
  
  res.send(sasUrl);

});

router.get('/queryTableEntities', function (req, res) {

  res.render('queryTableEntities', { title: "Query Table Entities" });
});

router.get('/getTableSasUrl', function (req, res) {

  var cn = config.connectionString;
  var tableService = storage.createTableService(cn);

  var tableName = req.query.tableName;

  var expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 30);

  var sharedAccessPolicy = {
    AccessPolicy: {
      Permissions: storage.TableUtilities.SharedAccessPermissions.QUERY
      + storage.TableUtilities.SharedAccessPermissions.ADD
      + storage.TableUtilities.SharedAccessPermissions.UPDATE
      + storage.TableUtilities.SharedAccessPermissions.DELETE,
      Expiry: expiryDate
    },
  };

  var sas = tableService.generateSharedAccessSignature(tableName, sharedAccessPolicy);

  var url = tableService.host.primaryHost; // TODO: there is no tableService.getUrl()

  res.send(url + '/' + tableName + "?" + sas);

});

router.get('/insertTableEntities', function (req, res) {

  res.render('insertTableEntities', { title: "Insert Table Entities" });
});

router.post('/createTableIfNotExists', function (req, res) {

  var tableName = req.query.tableName;
  if (!tableName) {
    res.send("Please specify a table name");
    return;
  }

  var cn = config.connectionString;
  var tableService = storage.createTableService(cn);

  tableService.createTableIfNotExists(tableName, function(error, result) {
    if(error) {
      res.send(error);
      return;
    }
    
    if(result.created) {
      res.send('Table created');
    } else{
      res.send('Table ' + tableName + ' already exists');
      return;
    }
  })
});

module.exports = router;
