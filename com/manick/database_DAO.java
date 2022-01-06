package com.manick;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class database_DAO {
	
	Connection conn = null;
	String attributeNames[] = null;
	String filename = null;
	String filePath = null;
	
	
	//connects to the database
		public void connect() {
			
			try {
				String connectionURL = "jdbc:mysql://localhost/custompattern";
				Class.forName("com.mysql.jdbc.Driver").newInstance(); 
				conn = DriverManager.getConnection(connectionURL, "root", "");
			} catch(Exception ex) {
				System.out.println("Error while connecting to database: " + ex.getMessage());
			}
		}
		
		
		//disconnects the databaseDAO object
		public void closeConnection() {
			try {
				conn.close();
			} catch (SQLException e) {
				System.out.println("Error while closing connections: " + e);
			}
		}
		
		//insert an new rule in the rules table
		public void insertConstraint(String ruleName,  String fieldsJSON, String regex) {
			String SQLquery;	
			try {	
			
				Statement st = conn.createStatement();
	    		if(!conn.isClosed()){
	    			
//	 	 			SQLquery = "INSERT INTO fields values (\"" + ruleName + "\",\""+ fieldsJSON + "\",\"" + regex + "\")";  
	    			SQLquery = "INSERT INTO fields values ('" + ruleName + "','"+ fieldsJSON + "','" + regex + "')";
	 				System.out.println(SQLquery);
	 	 			st.executeUpdate(SQLquery);
	    		}
			}  catch(Exception ex)	{
				System.out.println("Error while inserting fields: "+ex);
			} 
		}
}
