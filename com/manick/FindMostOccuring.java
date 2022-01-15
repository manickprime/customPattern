package com.manick;

import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;


/*
 * for finding the separator in the log file(works only if the first line in the log constains the 
 * attributes along with the separator
 * */

@WebServlet("/find")
public class FindMostOccuring extends HttpServlet {

       
    	protected void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
    		String filePath = req.getParameter("fileName");
    		int comma = 0, pipeline = 0, space = 0;
    		
    		String suggestedSeperator = " ";		
    		System.out.println(filePath);
    		
    		try {					
    			FileInputStream fis = new FileInputStream(filePath);
    			DataInputStream myInput = new DataInputStream(fis);	
    							
    			String CSVheader = myInput.readLine();
    			for(int i=0;i<CSVheader.length();i++) {
    				System.out.print(CSVheader.charAt(i));
    				if(CSVheader.charAt(i) == ',') comma++;
    				else if(CSVheader.charAt(i) == '|') pipeline++;
    				else if(CSVheader.charAt(i) == ' ') space++;
    				else {}
    			}
    			
    			System.out.println();
    			System.out.println(comma + " " + pipeline + " " + space);
    			
    			if(space > pipeline && space > comma) suggestedSeperator = "space";
    			else if (pipeline > comma) suggestedSeperator = "pipeline";
    			else suggestedSeperator="comma";

    			System.out.println("The suggested separator is: " + suggestedSeperator);
    				
    			myInput.close();
    			fis.close();
    		} catch (Exception ex) {
    			System.out.println("Error while traversing csv in the server side: " + ex);
    		}
    		
    		HashMap<String, String> map = new HashMap<>();
    		map.put("separator", suggestedSeperator);
    		
    		String jSONResult = new Gson().toJson(map);
    		System.out.println(jSONResult);
    		
    		
    		PrintWriter out = res.getWriter();
    		out.println(jSONResult);

	}

}
