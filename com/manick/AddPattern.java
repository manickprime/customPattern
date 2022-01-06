package com.manick;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;



@WebServlet("/addPattern")
public class AddPattern extends HttpServlet {
       
	protected void service(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
//		String regex = "@v {manick}55";
//		Xeger generator = new Xeger(regex);
//		String result = generator.generate();
		
		String ruleJSON = null, fieldJSONstring = null;
//		ruleJSON = req.getParameter("ruleJSON");
		fieldJSONstring = req.getParameter("fieldJSONstring");
		ruleJSON = "{\"ruleName\": \"rule1\", \"fields\": [ {\"fieldName\": \"as\",\"value\": \"ould\",\"prefix\": \"fd\",\"suffix\": \"gf\"}, {\"fieldName\": \"WQ\",\"value\": \"herelog\",\"prefix\": \"EF\",\"suffix\": \"FE\"}]}";
		System.out.println(ruleJSON);
		
		JSONObject obj = new JSONObject(ruleJSON);
		System.out.println(obj);
		
		
		String ruleName, fieldName, value, prefix, suffix, fieldArrayString;
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
		}
//		
		
		System.out.println(fieldJSONstring);
		database_DAO db = new database_DAO();
		db.connect();
		db.insertConstraint(ruleName, fieldJSONstring, "regex");
		db.closeConnection();
		
		
//		String prefix = "", suffix = "request", field = "hostname";
//		String p = Pattern.quote(prefix + " " + field + " " + suffix);
//		Pattern pattern = Pattern.compile(p);
//		
//		Matcher m = pattern.matcher("dvchost=hostname request");
//		System.out.println(m.matches());
//		
//		System.out.println(p);
//		Pattern p = Pattern.compile("{manick}}55");
//		Matcher m = p.matcher()
		
//		System.out.println("Generated regex:");
//		System.out.println(result);
//		System.out.println(generator);
	}

}
