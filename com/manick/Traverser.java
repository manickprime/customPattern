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


@WebServlet("/traverser")
public class Traverser extends HttpServlet {
public void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		
		String HLLseparator = req.getParameter("separator");
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
		
//		separator = " ";
		
		
//		String filePath = "C:\\Users\\mani-pt4556\\Downloads\\DhcpSrvLog-Mon.log.txt";
//		String filePath = "D:\\dummy.txt";
//		String filePath = "D:\\space.txt";
		
		
//		filePath = "D:\\space.txt";
//		separator = " ";
		
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

					
//				for(int i=0;i<row1.length;i++)
//					System.out.print(row1[i]+"::");
				
//				es.insertRow(row1, currentLine, thisLine);
				
//				System.out.println();
				if(separator!="\\|") {
//					es.insertRow(row1, currentLine, thisLine);
					if(!start) eSResponse += ", ";
					
//					Pattern pattern = Pattern.compile("^.*msg=User.*$");
					eSResponse += "{ \"data\":\"";
//					Matcher m = pattern.matcher(thisLine);

					for(int i=0;i<row1.length;i++) {
						eSResponse += row1[i] + ",";
						
					}
					eSResponse += "\"}";				
					start = false;
				}
				else {
//					es.insertRow(row1, thisLine);
					
					if(!start) eSResponse += ", ";
					
					Pattern pattern = Pattern.compile("^.*msg=User.*$");
					eSResponse += "{ \"data\":\"";
					Matcher m = pattern.matcher(thisLine);
					if(m.matches()) {
						System.out.println("match found");
					}
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
		
//		System.out.println("tada1");
//		if(separator!="\\|")
//			eSResponse = es.getLogs();
//		System.out.println("tada5");
		
//		System.out.println(eSResponse);
		out.println(eSResponse);
		
	}

}
