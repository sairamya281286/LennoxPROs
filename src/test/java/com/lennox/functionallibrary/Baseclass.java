package com.lennox.functionallibrary;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.apache.commons.io.FileUtils;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.interactions.Actions;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.DataProvider;


public class Baseclass {
	
	static GetConfig getconfig=new GetConfig();
	
	public static String baseURL=getconfig.getApplicationURL();
	public String username=getconfig.getUsername();
	public String password=getconfig.getPassword();
	public static String browser=getconfig.getBrowser();
	public static WebDriver driver;
	
	public static Logger logger;
	public Actions action;
	public JavascriptExecutor js;
	
	@BeforeClass
	public static void setup()
	{			
		logger = Logger.getLogger("LennoxQA");
		PropertyConfigurator.configure("Log4j.properties");
		
		if(browser.equals("chrome"))
		{
			System.setProperty("webdriver.chrome.driver",getconfig.getChromePath());
			driver=new ChromeDriver();
		}
		else if(browser.equals("firefox"))
		{
			System.setProperty("webdriver.gecko.driver",getconfig.getFirefoxPath());
			driver = new FirefoxDriver();
		}
		driver.manage().timeouts().implicitlyWait(10,TimeUnit.SECONDS);
		driver.get(baseURL);
		driver.manage().window().maximize();

	}
		
		@AfterClass
		public static void tearDown()
		{
			driver.quit();
		}
		
		public void captureScreen(WebDriver driver, String tcname) throws IOException {
			TakesScreenshot ts = (TakesScreenshot) driver;
			File source = ts.getScreenshotAs(OutputType.FILE);
			File target = new File(System.getProperty("user.dir") + "/Screenshots/" + tcname + ".png");
			FileUtils.copyFile(source, target);
			System.out.println("Screenshot taken");
			
		}
			
			public void mousehover(WebElement element)
			{
				action=new Actions(driver);
				action.moveToElement(element).build().perform();
				
			}
			
			public void jsClick(WebElement element)
			{
				js=(JavascriptExecutor) driver;
				js.executeScript("arguments[0].click();", element);
			}
		
			public void scrolldown()
			{
				js=(JavascriptExecutor) driver;
				js.executeScript("window.scrollBy(0,600)", "");				
			}
			
			
}
