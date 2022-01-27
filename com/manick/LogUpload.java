package com.manick;

import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/*
 * Applies the regex in the log, if the log matches the logs, it would be inserted in the ES and 
 * the uploaded logs would be shown in the website 
 * */

@WebServlet("/upload")
public class LogUpload extends HttpServlet{
	
	public void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		
		String HLLseparator = req.getParameter("separator");
		
		
		database_DAO db = new database_DAO();
		db.connect();
		
		String regex[] = db.getIncludedRules();
		db.closeConnection();

		String separator;
		if(HLLseparator.equals("pipeline"))	separator = "\\|";
		else if(HLLseparator.equals("comma")) separator = ",";
		else separator = " ";
		
//		System.out.println("Separator is: " + separator);
		
		PrintWriter out = res.getWriter();

		ES_DAO es = new ES_DAO();
		es.connect();
//		es.deleteDocuments();		

		String filePath = req.getParameter("fileName");
		String eSResponse = null;
		
		
		
//		for(int i=0;i<regex.length;i++) {
//			System.out.println(regex[i]);
//		}

		
		try {					
			FileInputStream fis = new FileInputStream(filePath);
			DataInputStream myInput = new DataInputStream(fis);	
							
			String CSVheader = null;
			Pattern commaPattern = Pattern.compile(",*[a-zA-Z0-9]*,"), spacePattern = Pattern.compile(" *[a-zA-Z0-9]* ");
			
			if(separator=="," || separator==" ") {
				for(int i=0;i<10;i++) {
					Pattern pattern;
					CSVheader = myInput.readLine();
					if(separator==",")
						pattern = commaPattern;
					else
						pattern = spacePattern;
					
					
					Matcher matcher = pattern.matcher(CSVheader);
					int count = 0;
					while(matcher.find()) {
						count++;
					}
					
					System.out.println(CSVheader);
					System.out.println(count);
					
					if(count>5) {
						break;
					}
				}
			} else {
				CSVheader = myInput.readLine();
			}
							
			 
		
			String currentLine[] = CSVheader.split(separator);
			String thisLine; 
			HashMap<String, String> matchedConstraints = new HashMap<String, String>();
			String headers = "{";
			
			String row1[];
			boolean start = true;
			while ((thisLine = myInput.readLine()) != null){
				row1 = thisLine.split(separator);	
				boolean matching = true, eachMatching;
				for(int i=0;i<regex.length;i++) {
					eachMatching = Pattern.matches( regex[i], thisLine);
					if(eachMatching) matchedConstraints.put( regex[i] , thisLine);
					matching &= eachMatching;
				}
				
//				for (Entry<String, String> mapElement : matchedConstraints.entrySet()) {
//		            String key = (String)mapElement.getKey();
//		            String value = ((String)mapElement.getValue());
//		            
//		            System.out.println(key+":"+value);
//		            System.out.println("////;lll.......l;l;l;l;l;l;l;l");
//		        }
				
				if(matching) {
					if(separator!="\\|") {
						es.insertRow(row1, thisLine);
						//while inserting the logs, insert as attributeName: value, so use the other es.insertRow
						start = false;
					}
					else {
						es.insertRow(row1, thisLine);
						start = false;
					}
				}
				
			}		
			
			eSResponse = es.getLogs();
//			System.out.println(eSResponse);
			
			myInput.close();			
		} catch (Exception ex) {
			System.out.println("Error while uploading csv in the server side: " + ex);
		}
		
		out.println(eSResponse);
	}
	
}
