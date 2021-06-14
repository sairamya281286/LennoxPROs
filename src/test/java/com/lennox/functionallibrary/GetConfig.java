package com.lennox.functionallibrary;

	import java.io.File;
	import java.io.FileInputStream;
	import java.util.Properties;

	public class GetConfig {

		Properties property;
		
		public GetConfig()
		{
			File src = new File("./Configuration/config.properties");

			try {
				FileInputStream fis = new FileInputStream(src);
				property = new Properties();
				property.load(fis);
			} catch (Exception e) {
				System.out.println("Exception is " + e.getMessage());
			}
		}
		
		public String getApplicationURL()
		{
			String url=property.getProperty("baseURL");
			return url;
		}
		
		public String getUsername()
		{
		String username=property.getProperty("username");
		return username;
		}
		
		public String getPassword()
		{
		String password=property.getProperty("password");
		return password;
		}
		
		public String getBrowser()
		{
		String chromepath=property.getProperty("browser");
		return chromepath;
		}
		
		
		public String getChromePath()
		{
		String chromepath=property.getProperty("chromepath");
		return chromepath;
		}
		
	
		public String getFirefoxPath()
		{
		String firefoxpath=property.getProperty("firefoxpath");
		return firefoxpath;
		}

		
	}



