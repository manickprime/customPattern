package com.rules;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.manick.ES_DAO;
import com.manick.database_DAO;

/*
 * Retrieves all the rules and it's status from the database and returns as JSON
 * */

@WebServlet("/getRules")
public class GetRules extends HttpServlet{
	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		database_DAO db = new database_DAO();
		db.connect();
		
		HashMap<String, Integer> rules = db.getRuleNameAndStatus();
		
		String resultString = new Gson().toJson(rules);
		
		System.out.println(resultString);
		
		db.closeConnection();
		
		PrintWriter out = res.getWriter();
		out.println(resultString);
	}

}
