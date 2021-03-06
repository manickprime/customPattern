package com.manick;

import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.elasticsearch.common.lucene.search.XMoreLikeThis;

/*
 * Traverses the log file in the given location and shows the first 10 lines to the user
 * to make the custom pattern
 * */

@WebServlet("/traverser")
public class Traverser extends HttpServlet {
public void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		
		String HLLseparator = req.getParameter("separator");

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
			String headers = "{";
	  		

			eSResponse = "[";
			String row1[];
			boolean start = true;
			int linesTraversed = 0;
			while ((thisLine = myInput.readLine()) != null){
				linesTraversed++;
				if(linesTraversed >= 10) break;

				
				
					row1 = thisLine.split(separator);

					if(separator!="\\|") {

						if(!start) eSResponse += ", ";

						eSResponse += "{ \"completeLog\":\"";
						for(int i=0;i<row1.length;i++) {
							eSResponse += row1[i] + ",";
						
						}
						eSResponse += "\"}";				
						start = false;
					}
					else {
					
						if(!start) eSResponse += ", ";
							
						eSResponse += "{ \"completeLog\":\"";
						for(int i=0;i<row1.length;i++) {
							eSResponse += row1[i] + ",";	
						}
						eSResponse += "\"}";				
						start = false;
					}
				
				
			}	
				
			eSResponse += "]";
			myInput.close();			
		} catch (Exception ex) {
			System.out.println("Error while traversing csv in the server side: " + ex);
		}
		out.println(eSResponse);
		
	}

}
