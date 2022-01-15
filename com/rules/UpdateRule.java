package com.rules;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.manick.database_DAO;

/**
 * Updates the rule on the database
 */
@WebServlet("/updateRule")
public class UpdateRule extends HttpServlet {

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		String ruleName = req.getParameter("ruleName");
		String regex = req.getParameter("regex");
		
		System.out.println(ruleName);
		System.out.println(regex);
		
		database_DAO db = new database_DAO();
		db.connect();
		db.updateRule(ruleName, regex);
		db.closeConnection();
	}

}
