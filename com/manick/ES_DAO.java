package com.manick;


import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.http.HttpHost;
import org.elasticsearch.action.bulk.BulkRequest;
import org.elasticsearch.action.bulk.BulkResponse;
import org.elasticsearch.action.delete.DeleteRequest;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.support.replication.ReplicationResponse;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.reindex.DeleteByQueryRequest;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.suggest.completion.RegexOptions;

import com.google.gson.JsonObject;

//contains all the functions which can be done in the ESs

public class ES_DAO {

	String elasticAddress = "http://localhost:9200/?timezone=UTC&page.size=250";
	Connection connection = null;
	RestHighLevelClient client = null;
	String fileName = "logs";
	String filePath = null;
	String[] headers = null; 
	
	//connects using jdbc
		public void connect() {
			String address = "jdbc:es://" + elasticAddress;      
			Properties connectionProperties = new Properties(); 
			connectionProperties.put("user", "");
			connectionProperties.put("password", "");
			
			try {
				
				Class.forName("org.elasticsearch.xpack.sql.jdbc.EsDriver");	
				client = new RestHighLevelClient(
				        RestClient.builder(
				                new HttpHost("localhost", 9200, "http"),
				                new HttpHost("localhost", 9201, "http")).build());

			    
			} catch (Exception e) {
				System.out.println("Errror while connecting to ES server:");
				e.printStackTrace();
			}
		}
	
		//close the connection with elasticsearch
//		public void closeConnection() {
//			try {
//				connection.close();
//				client.close();
//				
//			} catch (Exception e) {
//				e.printStackTrace();
//			}
//		}
		
		
		//insert an row in the given index with the matched constraints
		public void insertRow(String[] row, String[] headers, String completeLog) {
			try {

			    
			    Map<String, Object> jsonMap = new HashMap<>();
			    for(int i=0;i<row.length;i++) {
			    	jsonMap.put(headers[i], row[i]);
			    }
			    
			    
			    jsonMap.put("completeLog", completeLog);
			    
			    BulkRequest request = new BulkRequest();
			    IndexRequest indexRequest = new IndexRequest("logs").type("doc").source(jsonMap);
			    
			    
			    request.add(indexRequest);
			    BulkResponse response = client.bulk(request);
			    
			    IndexResponse indexResponse = client.index(indexRequest);
			    

			    ReplicationResponse.ShardInfo shardInfo = indexResponse.getShardInfo();
			    if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
			    	System.out.println("Shard successful");
			    }
			    if (shardInfo.getFailed() > 0) {
			        for (ReplicationResponse.ShardInfo.Failure failure :
			                shardInfo.getFailures()) {
			            String reason = failure.reason(); 
			        }
			    }
			    
	   
			} catch (Exception e) {
				System.out.println("Error while inserting log from ES: " + e.toString());
			}
		}
		
		//for |, just uploads the complete log as a field
		public void insertRow(String[] headers, String thisLine) {
			try {

			    
			    Map<String, Object> jsonMap = new HashMap<>();		    
			    BulkRequest request = new BulkRequest();
			    
			    jsonMap.put("completeLog", thisLine);
			    IndexRequest indexRequest = new IndexRequest("logs").type("doc").source(jsonMap);
			    
			    
			    request.add(indexRequest);
			    BulkResponse response = client.bulk(request);
			    
    
			    IndexResponse indexResponse = client.index(indexRequest);
			    

			    ReplicationResponse.ShardInfo shardInfo = indexResponse.getShardInfo();
			    if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
			    	System.out.println("Shard successful");
			    }
			    if (shardInfo.getFailed() > 0) {
			        for (ReplicationResponse.ShardInfo.Failure failure :
			                shardInfo.getFailures()) {
			            String reason = failure.reason(); 
			        }
			    }
			    
			} catch (Exception e) {
				System.out.println("Error while inserting log from ES: " + e.toString());
			}
		}
		
		
		//insert an row in the given index with the matched constraints
				public void insertRow(String[] row, String[] headers) {
					try {

					    
					    Map<String, Object> jsonMap = new HashMap<>();
					    for(int i=0;i<row.length;i++) {
					    	jsonMap.put(headers[i], row[i]);
					    }
					    
					    BulkRequest request = new BulkRequest();

					    IndexRequest indexRequest = new IndexRequest("logs").type("doc").source(jsonMap);
					    
					    
					    request.add(indexRequest);
					    BulkResponse response = client.bulk(request);
   
					    IndexResponse indexResponse = client.index(indexRequest);
					    

					    ReplicationResponse.ShardInfo shardInfo = indexResponse.getShardInfo();
					    if (shardInfo.getTotal() != shardInfo.getSuccessful()) {
					    	System.out.println("Shard successful");
					    }
					    if (shardInfo.getFailed() > 0) {
					        for (ReplicationResponse.ShardInfo.Failure failure :
					                shardInfo.getFailures()) {
					            String reason = failure.reason(); 
					        }
					    }
					    
			   
					} catch (Exception e) {
						System.out.println("Error while inserting log from ES: " + e.toString());
					}
				}
			
		
		//gets the uploaded logs from the database
		String getLogs() {

			String eSResponse = "";
			
			SearchRequest searchRequest = new SearchRequest("logs");
			searchRequest.types("doc");
			SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
			searchSourceBuilder.size(10000);
			searchRequest.source(searchSourceBuilder);
			
			try {
				SearchResponse searchResponse = client.search(searchRequest);
				
				
				SearchHits hits = searchResponse.getHits();
				
				SearchHit[] searchHits = hits.getHits();
				System.out.println(searchHits.length);
				for(int i=0;i<searchHits.length;i++) {
					
					SearchHit hit = searchHits[i];
					String sourceAsString = hit.getSourceAsString();
					Map<String, Object> sourceAsMap = hit.getSourceAsMap();	
					
					if(eSResponse.length()<=1) {
						eSResponse += "["+ sourceAsString;
					} else 
						eSResponse += "," + sourceAsString;
				}
				
			} catch (IOException e) {
				System.out.println("Error while getting logs from ES");
				e.printStackTrace();
			}
			
			eSResponse += "]";
			System.out.println(eSResponse);
			
			return eSResponse;
		}
		
		//deletes all the documents in an index
//		public void deleteDocuments() {
//			
//			DeleteByQueryRequest request =
//			        new DeleteByQueryRequest("logs","");
//			request.setConflicts("proceed");
////			request.setQuery(null);
//
//			try {
//				client.deleteByQuery(request, RequestOptions.DEFAULT);
//			} catch (Exception e) {
//				System.out.println("Error while deleting documents in elasticsearch: " + e.toString());
//				e.printStackTrace();
//			}
//			
//		}
		
	
}
