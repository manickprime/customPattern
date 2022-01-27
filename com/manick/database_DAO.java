package com.manick;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;

//contains functions for all the sql based database activites

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
	    			SQLquery = "INSERT INTO fields values ('" + ruleName + "','"+ fieldsJSON + "','" + regex + "', 0)";
	 				System.out.println(SQLquery);
	 	 			st.executeUpdate(SQLquery);
	    		}
			}  catch(Exception ex)	{
				System.out.println("Error while inserting constraints in fields: "+ex);
			} 
		}
		
		// to get the names of all the rules in the database
		public String[] getRulesName() {
			ArrayList<String> rules = new ArrayList<String>();
			
			try {
				if(!conn.isClosed()) {
					
					Statement st = conn.createStatement();
					
					ResultSet rs = st.executeQuery("SELECT ruleName FROM fields");
					while(rs.next()) {
						
						String temp = rs.getString(1);
						rules.add(temp);
						
					}
				}
				return rules.toArray(new String[0]);
				
			} catch (Exception ex) {
				System.out.println("Error while getting rules and their status: " + ex);
			}
			return rules.toArray(new String[0]);
		}
		
		
		//to get rules name and flag variable from the database
		public HashMap<String, Boolean> getRuleNameAndStatus() {
//			HashMap<String, Integer> rules = new HashMap<String, Integer>();
			HashMap<String, Boolean> rules = new HashMap<String, Boolean>();
			String query = "SELECT ruleName,flag FROM fields";
			
			try {
				if(!conn.isClosed()) {
				
					Statement st = conn.createStatement();
				
					ResultSet rs = st.executeQuery(query);
					while(rs.next()) {
					
						String ruleName = rs.getString("ruleName");
						int flag = rs.getInt("flag");
//						System.out.println(ruleName);
//						System.out.println(flag);
//						rules.put(ruleName, flag);
						if(flag==0)
							rules.put(ruleName, false);
						else
							rules.put(ruleName, true);
					
					}
		
					return rules;
				}
			
			} catch (Exception ex) {
				System.out.println("Error while getting rule name and status: " + ex);
			}
			return rules;
		}
		
		
		//to get rules name which are having status as 1
		public String[] getIncludedRules() {
			ArrayList<String> rules = new ArrayList<String>();
			
			try {
				if(!conn.isClosed()) {
					
					Statement st = conn.createStatement();
					ResultSet rs = st.executeQuery("SELECT regex FROM fields WHERE flag = 1");
					while(rs.next()) {

						String temp = rs.getString("regex");
						rules.add(temp);
						
					}
				}
				return rules.toArray(new String[0]);
				
			} catch (Exception ex) {
				System.out.println("Error while getting rules which are included: " + ex);
			}
			return rules.toArray(new String[0]);
		}		
	
		//to get regex from the rule name in the database
		public String getRegexFromName(String ruleName) {
			String query = "SELECT regex FROM fields WHERE ruleName = '" + ruleName + "'";
			String regex = null;
			
			try {
				if(!conn.isClosed()) {
				
					Statement st = conn.createStatement();
					ResultSet rs = st.executeQuery(query);
					while(rs.next()) {
						regex = rs.getString("regex");		
					}
		
					return regex;
				}
			
			} catch (Exception ex) {
				System.out.println("Error while getting regex from database: " + ex);
			}
			return regex;
		}
		
		
		
		//delete the specific rule  from the database
		public void deleteThisRule(String ruleName) {
			System.out.println("im going to delete a rule");
			String query = "DELETE FROM fields WHERE ruleName = \"" + ruleName + "\"";
			
			try {
				if(!conn.isClosed()) {
				
					Statement st = conn.createStatement();
					st.executeUpdate(query);
			
				}
			
			} catch (Exception ex) {
				System.out.println("Error while deleting single rule: " + ex);
			}
			
		}
		
		//update the status of the rules when they're enabled by the user
		public void updateStatus(String rules[]) {
			String query;
			try {
			
				Statement st = conn.createStatement();
	    		if(!conn.isClosed()){
	    			
	 					query = "UPDATE fields SET flag=0 WHERE 1";
	 					st.executeUpdate(query);
	    			
	    			System.out.println("updating in db");
	 					
	 					for(int i=0;i<rules.length;i++) {
	 						query = "UPDATE fields SET flag=1 WHERE ruleName=\"";
	 						query+= rules[i]+"\"";
	 						System.out.println(query);
	 	 	 				st.executeUpdate(query);
	 					}	
	    		}
	   
				
			}  catch(Exception ex)	{
				System.out.println("Error while updating including status of rules: "+ex);
			} 
		}
		
		//update the rules when they're enabled by the user
		public void updateRule(String ruleName, String updatedRegex) {
			String query;
			try {
			
				Statement st = conn.createStatement();
	    		if(!conn.isClosed()){
	    			
	 					query = "UPDATE fields SET regex='" + updatedRegex +"' WHERE ruleName = '" + ruleName + "'";
	 					st.executeUpdate(query);
	    		
	    		}
	   
				
			}  catch(Exception ex)	{
				System.out.println("Error while updating including rule's regex: "+ex);
			} 
		}		

}
