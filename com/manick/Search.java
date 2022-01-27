package com.manick;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class Search
 */
@WebServlet("/search")
public class Search extends HttpServlet {

	protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
		
		String query = req.getParameter("query");
		ES_DAO es = new ES_DAO();
		es.connect();
		String eSResponse = es.search(query);
		
		System.out.println(eSResponse);
		PrintWriter out = res.getWriter();
		out.println(eSResponse);
		
		
	}

}
