package com.manick;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.Gson;

/**
 * Servlet implementation class CustomPatternServlet
 */
@WebServlet("/customPatternServlet")
public class CustomPatternServlet extends HttpServlet {
	
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		String operation = req.getParameter("operation");
		String ruleJSON = null, fieldJSONstring = null;
		String ruleName, fieldName, value, prefix, suffix, fieldArrayString, regex = "^.*(";
		
		ruleJSON = req.getParameter("ruleJSON");
		fieldJSONstring = req.getParameter("fieldJSONstring");
		regex = parseFieldJSON(ruleJSON);
		
		if(operation.equals("addPattern")) { //add pattern
						
			JSONObject obj = new JSONObject(ruleJSON);
			ruleName = obj.getString("ruleName");

			database_DAO db = new database_DAO();
			db.connect();
			db.insertConstraint(ruleName, fieldJSONstring, regex);
			db.closeConnection();
			
		} else { //generate pattern
			
			HashMap<String, String> map = new HashMap<>();
			map.put("regex", regex);
			
			String jSONResult = new Gson().toJson(map);
			
			PrintWriter out = res.getWriter();
			out.println(jSONResult);
		}
		
	}
	
	String parseFieldJSON(String ruleJSON) {
		
		String ruleName, fieldName, value, prefix, suffix, regex = "^.*(";
		
		JSONObject obj = new JSONObject(ruleJSON);
		ruleName = obj.getString("ruleName");
		JSONArray arr = obj.getJSONArray("fields");
	
		for(int i=0;i<arr.length();i++) {
			fieldName = arr.getJSONObject(i).getString("fieldName");
			value = arr.getJSONObject(i).getString("value");
			prefix = arr.getJSONObject(i).getString("prefix");
			suffix = arr.getJSONObject(i).getString("suffix");
			regex += prefix + value + suffix;
			if(i<arr.length()-1)	regex += " | ";
		}
		regex += ").*$";
		System.out.println(regex);
		return regex;
	}

}
