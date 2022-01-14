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

@WebServlet("/upload")
public class LogUpload extends HttpServlet{
	
	public void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		
		String HLLseparator = req.getParameter("separator");
		
		
		database_DAO db = new database_DAO();
		db.connect();
		
		String regex[] = db.getIncludedRules();
		db.closeConnection();
//		String regex[] = req.getParameterValues("regexArray");
//		if(separator.equals("l"))
//			separator = "|";
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
	  		
//			for(int j=0;j<currentLine.length;j++)
//				System.out.print(currentLine[j]+"::");
//			System.out.println();
						
		    //reading lines from .csv files
			
			eSResponse = "[";
			String row1[];
			boolean start = true;
			while ((thisLine = myInput.readLine()) != null){
				row1 = thisLine.split(separator);
//				Pattern ptrn = Pattern.compile(regex[0]);
//				Matcher m = ptrn.matcher(thisLine);
//				if(m.matches()) {
//					System.out.println(thisLine);
//					System.out.println("=================");
//				} else {
//					
//				}
				
				if(Pattern.matches( regex[0] , thisLine)) {
					System.out.println(thisLine);
					System.out.println("=================");
					if(separator!="\\|") {}
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

				
				/*
				
				es.insertRow(row1, currentLine, thisLine);
				
				System.out.println();
				if(separator!="\\|") {}
					es.insertRow(row1, currentLine, thisLine);
				else {
					es.insertRow(row1, thisLine);
					
					if(!start) eSResponse += ", ";
					String prefix = "dmac=", suffix = "", field = "00:";
					String p = Pattern.quote(prefix + field + suffix);
					p = ".*" + p + ".*";
					Pattern pattern = Pattern.compile(p);
					
					System.out.println(thisLine);
					
					System.out.println(p);
					Matcher m = pattern.matcher(thisLine);
					System.out.println(m.matches());
					Pattern pattern = Pattern.compile("^.*msg=User.*$");
					eSResponse += "{ \"data\":\"";
					Matcher m = pattern.matcher(thisLine);
					if(m.matches()) {
						System.out.println(thisLine);
						
						if(!start) eSResponse += ", ";
						System.out.println("match found");
						eSResponse += "{ \"data\":\"";
						for(int i=0;i<row1.length;i++) {
							eSResponse += row1[i] + ",";
							
						}
						
						eSResponse += "\"}";
						start = false;
						
					}
					for(int i=0;i<row1.length;i++) {
						eSResponse += row1[i] + ",";
						
					}
					
					eSResponse += "\"}";				
					start = false;
				}
				*/
				
			}	
				
			eSResponse += "]";
			System.out.println(eSResponse);
			myInput.close();			
		} catch (Exception ex) {
			System.out.println("Error while traversing csv in the server side: " + ex);
		}
		/*
		System.out.println("tada1");
		if(separator!="\\|")
			eSResponse = es.getLogs();
		System.out.println("tada5");
		
		System.out.println(eSResponse);
		out.println(eSResponse);
		*/
		
		out.println(eSResponse);
	}
	
}
