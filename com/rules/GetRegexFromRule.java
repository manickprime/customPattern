package com.rules;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.manick.database_DAO;


@WebServlet("/getRegexFromRule")
public class GetRegexFromRule extends HttpServlet {

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		String ruleName = req.getParameter("ruleName");
		
		
		database_DAO db = new database_DAO();
		db.connect();
		String regex = db.getRegexFromName(ruleName);
		
		db.closeConnection();
		
		PrintWriter out = res.getWriter();
		out.println(regex);
		
	}

}
