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

/*
 * This generates the regex pattern from the user's input, this is for showing the regex 
 * everytime the user request(doesn't upload the regex in the database)
 * */

@WebServlet("/generatePattern")
public class generatePattern extends HttpServlet{
	protected void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
	
		String ruleJSON = null, fieldJSONstring = null;
		String ruleName, fieldName, value, prefix, suffix, fieldArrayString, regex = "^.*(";
		
		
		ruleJSON = req.getParameter("ruleJSON");
		fieldJSONstring = req.getParameter("fieldJSONstring");
		System.out.println(ruleJSON);
		
		JSONObject obj = new JSONObject(ruleJSON);
		
		
		
	
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
		
		
		HashMap<String, String> map = new HashMap<>();
		map.put("regex", regex);
		
		String jSONResult = new Gson().toJson(map);
		System.out.println(jSONResult);
		
		System.out.println(fieldJSONstring);
		PrintWriter out = res.getWriter();
		out.println(jSONResult);

	}
}
