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

@WebServlet("/generatePattern")
public class generatePattern extends HttpServlet{
	protected void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
//		String regex = "@v {manick}55";
//		Xeger generator = new Xeger(regex);
//		String result = generator.generate();
		
		String ruleJSON = null, fieldJSONstring = null;
		ruleJSON = req.getParameter("ruleJSON");
		fieldJSONstring = req.getParameter("fieldJSONstring");
//		ruleJSON = "{\"ruleName\": \"rule1\", \"fields\": [ {\"fieldName\": \"as\",\"value\": \"ould\",\"prefix\": \"fd\",\"suffix\": \"gf\"}, {\"fieldName\": \"WQ\",\"value\": \"herelog\",\"prefix\": \"EF\",\"suffix\": \"FE\"}]}";
		System.out.println(ruleJSON);
		
		JSONObject obj = new JSONObject(ruleJSON);
		System.out.println(obj);
		
		
		String ruleName, fieldName, value, prefix, suffix, fieldArrayString, regex = "^.*(";
//		
		ruleName = obj.getString("ruleName");
		System.out.println(ruleName);
		JSONArray arr = obj.getJSONArray("fields");
//		fieldArrayString = obj.getString("fields");
//		System.out.println("++");
//		System.out.println(fieldArrayString);
//		System.out.println("++");
//		
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
//		
		
		
		HashMap<String, String> map = new HashMap<>();
		map.put("regex", regex);
		
		String jSONResult = new Gson().toJson(map);
		System.out.println(jSONResult);
		
		System.out.println(fieldJSONstring);
		PrintWriter out = res.getWriter();
		out.println(jSONResult);

	}
}
