package com.rules;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.manick.database_DAO;

/*
 * get the rules which are being selected by the user(which has flag = 1) in the database
 * */

@WebServlet("/getIncludedRules")
public class GetIncludedRules extends HttpServlet {

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		database_DAO db = new database_DAO();
		db.connect();
		
		String rules[] = db.getIncludedRules();
		
		db.closeConnection();
		
		String jSONRules = new Gson().toJson(rules);
		System.out.println(jSONRules);
		
		PrintWriter out = res.getWriter();
		out.println(rules);
		
	}

}
