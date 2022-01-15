package com.manick;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;



/*
creates a basic regex from the suffix, prefix and the value, and this stores the generated regex 
in the database 
*/

@WebServlet("/addPattern")
public class AddPattern extends HttpServlet {
       
	protected void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		String ruleJSON = null, fieldJSONstring = null;
		ruleJSON = req.getParameter("ruleJSON");
		fieldJSONstring = req.getParameter("fieldJSONstring");
		System.out.println(ruleJSON);
		
		JSONObject obj = new JSONObject(ruleJSON);
		System.out.println(obj);
		
		
		String ruleName, fieldName, value, prefix, suffix, fieldArrayString, regex = "^.*(";
		
		ruleName = obj.getString("ruleName");
		System.out.println(ruleName);
		JSONArray arr = obj.getJSONArray("fields");
	
		for(int i=0;i<arr.length();i++) {
			fieldName = arr.getJSONObject(i).getString("fieldName");
			value = arr.getJSONObject(i).getString("value");
			prefix = arr.getJSONObject(i).getString("prefix");
			suffix = arr.getJSONObject(i).getString("suffix");
			System.out.println(fieldName + ":" + value + ":" + prefix + ":" + suffix);
			regex += prefix + value + suffix;
			if(i<arr.length()-1)	regex += " | ";
		}
		regex += ").*$";
		System.out.println(regex);

		
		System.out.println(fieldJSONstring);
		database_DAO db = new database_DAO();
		db.connect();
		db.insertConstraint(ruleName, fieldJSONstring, regex);
		db.closeConnection();
		

	}

}
