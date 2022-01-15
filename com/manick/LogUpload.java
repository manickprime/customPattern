package com.manick;

import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.spec.X509EncodedKeySpec;
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
		
		System.out.println("Separator is: " + separator);
		
		PrintWriter out = res.getWriter();

		ES_DAO es = new ES_DAO();
		es.connect();
		

		String filePath = req.getParameter("fileName");
		String eSResponse = null;
		
		
		
		for(int i=0;i<regex.length;i++) {
			System.out.println(regex[i]);
		}

		
		try {					
			FileInputStream fis = new FileInputStream(filePath);
			DataInputStream myInput = new DataInputStream(fis);	
							
			String CSVheader = myInput.readLine();
			String currentLine[] = CSVheader.split(separator);
			String thisLine; 
			String headers = "{";
			
			eSResponse = "[";
			String row1[];
			boolean start = true;
			while ((thisLine = myInput.readLine()) != null){
				row1 = thisLine.split(separator);	
				boolean matching = true;
				for(int i=0;i<regex.length;i++) {
					matching &= Pattern.matches( regex[i], thisLine);
				}
				if(matching) {
					System.out.println(thisLine);
					System.out.println("=================");
					if(separator!="\\|") {
//						es.insertRow(row1, thisLine);
						//while inserting the logs, insert as attributeName: value, so use the other es.insertRow
						if(!start) eSResponse += ", ";
						eSResponse += "{ \"data\":\"";
						for(int i=0;i<row1.length;i++) {
							eSResponse += row1[i] + ",";
						}
						eSResponse += "\"}";
						start = false;
					}
					else {
						es.insertRow(row1, thisLine);
						if(!start) eSResponse += ", ";
						eSResponse += "{ \"data\":\"";
						for(int i=0;i<row1.length;i++) {
							eSResponse += row1[i] + ",";
						}
						eSResponse += "\"}";
						start = false;
						
					}
				}
				
			}	
				
			eSResponse += "]";
			System.out.println(eSResponse);
			myInput.close();			
		} catch (Exception ex) {
			System.out.println("Error while traversing csv in the server side: " + ex);
		}
		
		out.println(eSResponse);
	}
	
}
